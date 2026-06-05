import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

const FLW_BASE = process.env.FLW_BASE_URL || "https://api.flutterwave.com";
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tx_ref = searchParams.get("tx_ref");
    const transaction_id = searchParams.get("transaction_id");
    const returnStatus = searchParams.get("status");

    if (!tx_ref) {
      return NextResponse.redirect(`${APP_URL}/payment-failed?error=missing_reference`);
    }

    if (returnStatus && !["successful", "completed"].includes(returnStatus.toLowerCase())) {
      return NextResponse.redirect(`${APP_URL}/payment-failed?orderId=${encodeURIComponent(tx_ref)}&error=${encodeURIComponent(returnStatus)}`);
    }

    if (!FLW_SECRET_KEY) {
      throw new Error("Flutterwave secret key is not configured");
    }

    const order = await prisma.order.findUnique({
      where: { orderId: tx_ref },
    });
    if (!order) {
      return NextResponse.redirect(`${APP_URL}/payment-failed?error=order_not_found`);
    }

    const verifyUrl = `${FLW_BASE}/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(tx_ref)}`;
    const res = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
      },
    });
    const rawData = await res.json();
    const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
    console.log("Flutterwave verify response:", data);

    if (!res.ok || !data?.status || data.status !== "success") {
      const message = data?.message || data?.status || `verification_failed`;
      return NextResponse.redirect(`${APP_URL}/payment-failed?orderId=${order.orderId}&error=${encodeURIComponent(message)}`);
    }

    const transaction = data?.data;
    if (!transaction) {
      return NextResponse.redirect(`${APP_URL}/payment-failed?orderId=${order.orderId}&error=no_transaction_data`);
    }

    const verifiedTxRef = String(transaction.tx_ref || transaction.txref || "");
    const verifiedAmount = Number(transaction.amount || 0);
    const verifiedStatus = String(transaction.status || "").toLowerCase();
    const verifiedId = String(transaction.id || transaction.transaction_id || transaction_id || "");
    const paidAt = transaction.created_at ? new Date(transaction.created_at) : new Date();

    if (verifiedTxRef !== tx_ref) {
      return NextResponse.redirect(`${APP_URL}/payment-failed?orderId=${order.orderId}&error=reference_mismatch`);
    }

    if (!["successful", "completed"].includes(verifiedStatus)) {
      return NextResponse.redirect(`${APP_URL}/payment-failed?orderId=${order.orderId}&error=payment_not_successful`);
    }

    const depositAmount = order.depositAmount || Math.round(order.totalAmount / 2);
    if (verifiedAmount < depositAmount) {
      return NextResponse.redirect(`${APP_URL}/payment-failed?orderId=${order.orderId}&error=amount_mismatch`);
    }

    if (order.paymentStatus === "DEPOSIT_PAID") {
      return NextResponse.redirect(`${APP_URL}/payment-success?orderId=${order.orderId}`);
    }

    await prisma.order.update({
      where: { orderId: order.orderId },
      data: {
        paymentStatus: "DEPOSIT_PAID",
        status: "deposit_paid",
        amountPaid: verifiedAmount,
        transactionReference: tx_ref,
        flutterwaveTransactionId: verifiedId,
        paidAt,
      },
    });

    return NextResponse.redirect(`${APP_URL}/payment-success?orderId=${order.orderId}`);
  } catch (error: any) {
    console.error("Flutterwave verification error:", error);
    return NextResponse.redirect(`${APP_URL}/payment-failed?error=${encodeURIComponent(error.message || String(error))}`);
  }
}
