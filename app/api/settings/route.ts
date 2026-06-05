import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create default settings if they don't exist
      const newSettings = await prisma.settings.create({
        data: {
          id: "default",
          setupFee: 15000,
          customColourFee: 5000,
          depositPercentage: 50,
          quoteValidHours: 48,
          expressSurchargePercent: 25,
          labEmail: "pearllabsug@gmail.com",
          labPhone: "+256 (0) 200 901 001",
          labAddress: "Kololo, Kampala, Uganda",
          slicerPreviewEnabled: true,
          maintenanceMode: false,
        },
      });
      return NextResponse.json(newSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const settings = await prisma.settings.updateMany({
      where: {},
      data: body,
    });

    const updatedSettings = await prisma.settings.findFirst();
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
