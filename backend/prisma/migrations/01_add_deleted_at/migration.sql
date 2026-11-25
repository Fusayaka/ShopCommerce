-- AlterTable
ALTER TABLE "products" ADD COLUMN "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "product_stocks" ADD COLUMN "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "promo_codes" ADD COLUMN "deleted_at" TIMESTAMP(6);

