-- Mevcut Türkçe ürün adı/açıklaması kaybolmasın diye drop+add yerine rename ediliyor.
ALTER TABLE "products" RENAME COLUMN "urun" TO "urunTr";
ALTER TABLE "products" RENAME COLUMN "aciklama" TO "aciklamaTr";

-- AlterTable
ALTER TABLE "products"
ADD COLUMN     "urunEn" TEXT,
ADD COLUMN     "urunRu" TEXT,
ADD COLUMN     "urunAr" TEXT,
ADD COLUMN     "urunAz" TEXT,
ADD COLUMN     "aciklamaEn" TEXT,
ADD COLUMN     "aciklamaRu" TEXT,
ADD COLUMN     "aciklamaAr" TEXT,
ADD COLUMN     "aciklamaAz" TEXT;
