/*
  Warnings:

  - Added the required column `balanceAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depositAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
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
    "totalAmount" INTEGER NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "balanceAmount" INTEGER NOT NULL,
    "amountPaid" INTEGER NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentProvider" TEXT NOT NULL DEFAULT 'flutterwave',
    "transactionReference" TEXT,
    "flutterwaveTransactionId" TEXT,
    "paidAt" DATETIME,
    "estWeightGrams" INTEGER NOT NULL,
    "estPrintHours" INTEGER NOT NULL,
    "estPrintMinutes" INTEGER NOT NULL,
    "readyAt" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("balancePrice", "colour", "createdAt", "customerEmail", "customerName", "customerPhone", "depositPrice", "estPrintHours", "estPrintMinutes", "estWeightGrams", "fileName", "id", "infill", "layerHeight", "material", "notes", "orderId", "postProcessing", "postProcessingCost", "printType", "priority", "quality", "quantity", "readyAt", "status", "totalPrice", "updatedAt") SELECT "balancePrice", "colour", "createdAt", "customerEmail", "customerName", "customerPhone", "depositPrice", "estPrintHours", "estPrintMinutes", "estWeightGrams", "fileName", "id", "infill", "layerHeight", "material", "notes", "orderId", "postProcessing", "postProcessingCost", "printType", "priority", "quality", "quantity", "readyAt", "status", "totalPrice", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");
CREATE UNIQUE INDEX "Order_transactionReference_key" ON "Order"("transactionReference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
