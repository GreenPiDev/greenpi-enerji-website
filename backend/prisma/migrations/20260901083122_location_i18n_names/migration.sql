-- Mevcut Türkçe isimler kaybolmasın diye "ad" sütunu drop+add yerine rename ediliyor.
ALTER TABLE "locations" RENAME COLUMN "ad" TO "adTr";

-- AlterTable
ALTER TABLE "locations"
ADD COLUMN     "adAr" TEXT,
ADD COLUMN     "adAz" TEXT,
ADD COLUMN     "adEn" TEXT,
ADD COLUMN     "adRu" TEXT;
