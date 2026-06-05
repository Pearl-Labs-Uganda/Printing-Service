import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "pearllabsug@gmail.com";
const ADMIN_PASSWORD = "Pearllabs@2026";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 403 }
      );
    }

    const adminUser = await prisma.adminUser.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({
      success: true,
      user: {
        email: adminUser.email,
        id: adminUser.id,
      },
    });
  } catch (error) {
    console.error("Failed to verify admin:", error);
    return NextResponse.json(
      { error: "Failed to verify admin" },
      { status: 500 }
    );
  }
}
