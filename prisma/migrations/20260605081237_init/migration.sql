-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "material" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "layerHeight" REAL NOT NULL,
    "infill" INTEGER NOT NULL,
    "quality" TEXT NOT NULL,
    "printType" TEXT NOT NULL,
    "postProcessing" TEXT NOT NULL,
    "postProcessingCost" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "depositPrice" INTEGER NOT NULL,
    "balancePrice" INTEGER NOT NULL,
    "estWeightGrams" INTEGER NOT NULL,
    "estPrintHours" INTEGER NOT NULL,
    "estPrintMinutes" INTEGER NOT NULL,
    "readyAt" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricePerGram" REAL NOT NULL,
    "colours" TEXT NOT NULL DEFAULT 'Red,Yellow,Black,White',
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "setupFee" INTEGER NOT NULL DEFAULT 15000,
    "customColourFee" INTEGER NOT NULL DEFAULT 5000,
    "depositPercentage" INTEGER NOT NULL DEFAULT 50,
    "quoteValidHours" INTEGER NOT NULL DEFAULT 48,
    "expressSurchargePercent" INTEGER NOT NULL DEFAULT 25,
    "labEmail" TEXT NOT NULL DEFAULT 'pearllabsug@gmail.com',
    "labPhone" TEXT NOT NULL DEFAULT '+256 (0) 200 901 001',
    "labAddress" TEXT NOT NULL DEFAULT 'Kololo, Kampala, Uganda',
    "slicerPreviewEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");
