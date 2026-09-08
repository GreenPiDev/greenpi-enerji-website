import type { Product, ProductLocation, ProductCategory } from "@prisma/client";

type ProductWithRelations = Product & {
  lokasyonlar: ProductLocation[];
  kategoriler: ProductCategory[];
};

export function serializeProduct(p: ProductWithRelations) {
  return {
    id: p.id,
    marka: p.marka,
    urunTr: p.urunTr,
    urunEn: p.urunEn,
    urunRu: p.urunRu,
    urunAr: p.urunAr,
    urunAz: p.urunAz,
    katalogLink: p.katalogLink,
    urunWebLink: p.urunWebLink,
    datasheetLink: p.datasheetLink,
    gorselUrl: p.gorselUrl,
    aciklamaTr: p.aciklamaTr,
    aciklamaEn: p.aciklamaEn,
    aciklamaRu: p.aciklamaRu,
    aciklamaAr: p.aciklamaAr,
    aciklamaAz: p.aciklamaAz,
    yayinda: p.yayinda,
    ozetGoruntulemeSayisi: p.ozetGoruntulemeSayisi,
    detayGoruntulemeSayisi: p.detayGoruntulemeSayisi,
    lokasyonlar: p.lokasyonlar.map((l) => l.locationId),
    kategoriler: p.kategoriler.map((k) => k.categoryId),
  };
}

export const productInclude = {
  lokasyonlar: true,
  kategoriler: true,
} as const;
