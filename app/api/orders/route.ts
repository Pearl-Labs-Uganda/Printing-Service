import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const DEPOSIT_PERCENTAGE = 0.5;

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      fileName,
      material,
      colour,
      quantity,
      layerHeight,
      infill,
      quality,
      printType,
      postProcessing,
      postProcessingCost,
      readyAt,
      estWeightGrams,
      estPrintHours,
      estPrintMinutes,
      totalAmount,
    } = body;

    const rawPhone = String(customerPhone || "").trim();
    const digitsOnlyPhone = rawPhone.replace(/\D/g, "");
    const cleanedPhone = digitsOnlyPhone.startsWith("0")
      ? `256${digitsOnlyPhone.slice(1)}`
      : digitsOnlyPhone.startsWith("7")
      ? `256${digitsOnlyPhone}`
      : digitsOnlyPhone;
    const cleanedEmail = String(customerEmail || "").trim().toLowerCase();

    if (
      !customerName ||
      !cleanedEmail ||
      !cleanedPhone ||
      !fileName ||
      !material ||
      !colour ||
      !quantity ||
      totalAmount == null
    ) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const depositAmount = Math.round(totalAmount * DEPOSIT_PERCENTAGE);
    const balanceAmount = totalAmount - depositAmount;
    const orderId = `PL3D-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await prisma.order.create({
      data: {
        orderId,
        customerName,
        customerEmail: cleanedEmail,
        customerPhone: cleanedPhone,
        fileName,
        material,
        colour,
        quantity,
        layerHeight: Number(layerHeight),
        infill: Number(infill),
        quality: quality?.toString() || "Standard",
        printType,
        postProcessing,
        postProcessingCost: Number(postProcessingCost || 0),
        totalPrice: totalAmount,
        depositPrice: depositAmount,
        balancePrice: balanceAmount,
        totalAmount,
        depositAmount,
        balanceAmount,
        amountPaid: 0,
        paymentStatus: "PENDING",
        paymentProvider: "flutterwave",
        status: "pending_payment",
        estWeightGrams: Number(estWeightGrams || 0),
        estPrintHours: Number(estPrintHours || 0),
        estPrintMinutes: Number(estPrintMinutes || 0),
        readyAt: readyAt || "Pending",
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
