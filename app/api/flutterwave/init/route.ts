import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

const FLW_BASE = process.env.FLW_BASE_URL || "https://api.flutterwave.com";
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    if (!FLW_SECRET_KEY) {
      throw new Error("Flutterwave secret key is not configured");
    }

    const order = await prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "DEPOSIT_PAID") {
      return NextResponse.json({ error: "Order deposit already paid" }, { status: 409 });
    }

    const depositAmount = order.depositAmount || Math.round(order.totalAmount / 2);
    const redirectUrl = `${APP_URL}/api/flutterwave/verify`;
    const rawPhone = order.customerPhone?.trim() || "";
    const digitsOnlyPhone = rawPhone.replace(/\D/g, "");
    const cleanedPhone = digitsOnlyPhone.startsWith("0")
      ? `256${digitsOnlyPhone.slice(1)}`
      : digitsOnlyPhone.startsWith("7")
      ? `256${digitsOnlyPhone}`
      : digitsOnlyPhone;

    if (!cleanedPhone.match(/^256[0-9]{9,10}$/)) {
      return NextResponse.json({ error: `Invalid Uganda mobile money number: ${cleanedPhone}` }, { status: 400 });
    }

    const payload = {
      tx_ref: order.orderId,
      amount: String(depositAmount),
      currency: "UGX",
      redirect_url: redirectUrl,
      payment_options: "mobilemoneyuganda",
      email: order.customerEmail,
      phone_number: cleanedPhone,
      fullname: order.customerName,
      customer: {
        email: order.customerEmail,
        phonenumber: cleanedPhone,
        phone_number: cleanedPhone,
        name: order.customerName,
      },
      customizations: {
        title: "Pearl Labs 3D Print Deposit",
        description: `50% deposit for order ${order.orderId}`,
      },
      meta: {
        orderId: order.orderId,
      },
    };

    const res = await fetch(`${FLW_BASE}/v3/charges?type=mobile_money_uganda`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawData = await res.json();
    const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

    // Log full response so we can see what Flutterwave returns for MoMo Uganda
    console.log("Flutterwave init response:", JSON.stringify(data, null, 2));

    if (!res.ok || !data?.status || data.status !== "success") {
      const errorMessage = data?.message || `Flutterwave init failed: ${res.status}`;
      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    const mode = data?.meta?.authorization?.mode;
    const flwRef = data?.data?.flw_ref;

    console.log("MoMo auth mode:", mode, "flw_ref:", flwRef);

    // Mobile Money Uganda returns a redirect link or OTP mode
    const checkoutUrl =
      data?.data?.link ||
      data?.data?.checkout_url ||
      data?.meta?.authorization?.redirect;

    if (checkoutUrl) {
      // Redirect flow — send customer to Flutterwave hosted page
      return NextResponse.json({ checkoutUrl, mode: "redirect" });
    }

    if (mode === "otp" || mode === "pin") {
      // OTP flow — customer enters OTP on your own UI
      return NextResponse.json({
        mode,
        flwRef,
        message: data?.message || "OTP sent to customer phone",
      });
    }

    if (mode === "callback" || !mode) {
      // Callback/polling flow — Flutterwave will notify via webhook
      return NextResponse.json({
        mode: "callback",
        flwRef,
        message: "Payment request sent. Customer will receive a prompt on their phone.",
      });
    }

    // Fallback — unknown mode, log and return raw data for debugging
    return NextResponse.json({
      mode: "unknown",
      flwRef,
      raw: data,
      message: "Unexpected Flutterwave response — check server logs",
    });

  } catch (error: any) {
    console.error("Flutterwave init error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}