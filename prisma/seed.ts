import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  await prisma.adminUser.upsert({
    where: { email: "pearllabsug@gmail.com" },
    update: {},
    create: { email: "pearllabsug@gmail.com" },
  });

  // Create materials
  await prisma.material.upsert({
    where: { name: "PLA" },
    update: {},
    create: {
      name: "PLA",
      description: "Standard 3D printing material - eco-friendly and easy to print",
      pricePerGram: 0.15,
      colours: "Red,Yellow,Black,White",
      inStock: true,
    },
  });

  // Create settings
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
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

  // Create sample orders
  const orders = [
    {
      orderId: "PL3D-10234",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+256 701 123 456",
      fileName: "miniature-figurine.stl",
      status: "printing",
      priority: "normal",
      material: "PLA",
      colour: "Red",
      quantity: 1,
      layerHeight: 0.2,
      infill: 20,
      quality: "medium",
      printType: "miniature",
      postProcessing: "none",
      postProcessingCost: 0,
      totalPrice: 250000,
      depositPrice: 125000,
      balancePrice: 125000,
      totalAmount: 250000,
      depositAmount: 125000,
      balanceAmount: 125000,
      amountPaid: 0,
      paymentStatus: "PENDING",
      paymentProvider: "flutterwave",
      estWeightGrams: 45,
      estPrintHours: 3,
      estPrintMinutes: 30,
      readyAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      notes: "Rush order - customer needs by Thursday",
    },
    {
      orderId: "PL3D-10235",
      customerName: "Sarah Smith",
      customerEmail: "sarah@example.com",
      customerPhone: "+256 702 234 567",
      fileName: "mechanical-part.stl",
      status: "deposit_paid",
      priority: "express",
      material: "PLA",
      colour: "Black",
      quantity: 5,
      layerHeight: 0.15,
      infill: 30,
      quality: "high",
      printType: "mechanical",
      postProcessing: "sanding",
      postProcessingCost: 50000,
      totalPrice: 520000,
      depositPrice: 260000,
      balancePrice: 260000,
      totalAmount: 520000,
      depositAmount: 260000,
      balanceAmount: 260000,
      amountPaid: 260000,
      paymentStatus: "DEPOSIT_PAID",
      paymentProvider: "flutterwave",
      transactionReference: "FLW-12345",
      flutterwaveTransactionId: "123456789",
      paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      estWeightGrams: 120,
      estPrintHours: 8,
      estPrintMinutes: 15,
      readyAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Parts for robotics project",
    },
    {
      orderId: "PL3D-10236",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      customerPhone: "+256 703 345 678",
      fileName: "decorative-vase.stl",
      status: "ready_for_pickup",
      priority: "normal",
      material: "PLA",
      colour: "Yellow",
      quantity: 1,
      layerHeight: 0.2,
      infill: 15,
      quality: "standard",
      printType: "decorative",
      postProcessing: "painting",
      postProcessingCost: 75000,
      totalPrice: 180000,
      depositPrice: 90000,
      balancePrice: 90000,
      totalAmount: 180000,
      depositAmount: 90000,
      balanceAmount: 90000,
      amountPaid: 180000,
      paymentStatus: "DEPOSIT_PAID",
      paymentProvider: "flutterwave",
      transactionReference: "FLW-12346",
      flutterwaveTransactionId: "987654321",
      paidAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      estWeightGrams: 35,
      estPrintHours: 2,
      estPrintMinutes: 45,
      readyAt: new Date().toISOString(),
      notes: "Paint with acrylic - gold and burgundy",
    },
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: { orderId: order.orderId },
      update: {},
      create: order,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
