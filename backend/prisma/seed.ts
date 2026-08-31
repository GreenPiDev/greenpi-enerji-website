import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "data");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(dataDir, file), "utf-8"));
}

type Location = { id: string; ad: string };
type Category = { id: string; ad: string };
type Product = {
  id: string;
  marka: string;
  urun: string;
  katalogLink: string | null;
  urunWebLink: string | null;
  datasheetLink: string | null;
  lokasyonlar: string[];
  kategoriler: string[];
};

async function main() {
  const locations = readJson<Location[]>("locations.json");
  const categories = readJson<Category[]>("categories.json");
  const products = readJson<Product[]>("products.json");

  for (const [i, loc] of locations.entries()) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: { ad: loc.ad, sira: i },
      create: { id: loc.id, ad: loc.ad, sira: i },
    });
  }

  for (const [i, cat] of categories.entries()) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { ad: cat.ad, sira: i },
      create: { id: cat.id, ad: cat.ad, sira: i },
    });
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        marka: p.marka,
        urun: p.urun,
        katalogLink: p.katalogLink,
        urunWebLink: p.urunWebLink,
        datasheetLink: p.datasheetLink,
      },
      create: {
        id: p.id,
        marka: p.marka,
        urun: p.urun,
        katalogLink: p.katalogLink,
        urunWebLink: p.urunWebLink,
        datasheetLink: p.datasheetLink,
      },
    });

    await prisma.productLocation.deleteMany({ where: { productId: p.id } });
    if (p.lokasyonlar.length) {
      await prisma.productLocation.createMany({
        data: p.lokasyonlar.map((locationId) => ({ productId: p.id, locationId })),
      });
    }

    await prisma.productCategory.deleteMany({ where: { productId: p.id } });
    if (p.kategoriler.length) {
      await prisma.productCategory.createMany({
        data: p.kategoriler.map((categoryId) => ({ productId: p.id, categoryId })),
      });
    }
  }

  console.log(`Seed tamam: ${locations.length} lokasyon, ${categories.length} kategori, ${products.length} urun`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
