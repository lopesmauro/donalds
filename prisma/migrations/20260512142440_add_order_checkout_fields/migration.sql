-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH');

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PIX',
ADD COLUMN "customerName" TEXT NOT NULL DEFAULT '',
ADD COLUMN "customerPhone" TEXT NOT NULL DEFAULT '',
ADD COLUMN "customerDocument" TEXT,
ADD COLUMN "changeFor" DOUBLE PRECISION,
ADD COLUMN "notes" TEXT;
