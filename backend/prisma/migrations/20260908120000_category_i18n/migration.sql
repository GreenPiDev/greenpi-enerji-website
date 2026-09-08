-- Mevcut Türkçe isimler kaybolmasın diye "ad" sütunu drop+add yerine rename ediliyor.
ALTER TABLE "categories" RENAME COLUMN "ad" TO "adTr";

-- AlterTable
ALTER TABLE "categories"
ADD COLUMN     "adAr" TEXT,
ADD COLUMN     "adAz" TEXT,
ADD COLUMN     "adEn" TEXT,
ADD COLUMN     "adRu" TEXT,
ADD COLUMN     "aciklamaAr" TEXT,
ADD COLUMN     "aciklamaAz" TEXT,
ADD COLUMN     "aciklamaEn" TEXT,
ADD COLUMN     "aciklamaRu" TEXT,
ADD COLUMN     "aciklamaTr" TEXT;
