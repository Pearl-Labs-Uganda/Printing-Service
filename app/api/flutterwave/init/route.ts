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
    const cleanedPhone = order.customerPhone?.trim().replace(/\s+/g, "") || "";

    const payload = {
      tx_ref: order.orderId,
      amount: String(depositAmount),
      currency: "UGX",
      redirect_url: redirectUrl,
      payment_options: "card,mobilemoneyuganda",
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

    if (!res.ok || !data?.status || data.status !== "success") {
      const errorMessage = data?.message || `Flutterwave init failed: ${res.status}`;
      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    const checkoutUrl =
      data?.data?.link ||
      data?.data?.checkout_url ||
      data?.meta?.authorization?.redirect;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "Invalid Flutterwave response" }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    console.error("Flutterwave init error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
