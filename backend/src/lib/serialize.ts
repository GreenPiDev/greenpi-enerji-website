import type { Product, ProductLocation, ProductCategory } from "@prisma/client";

type ProductWithRelations = Product & {
  lokasyonlar: ProductLocation[];
  kategoriler: ProductCategory[];
};

export function serializeProduct(p: ProductWithRelations) {
  return {
    id: p.id,
    marka: p.marka,
    urun: p.urun,
    katalogLink: p.katalogLink,
    urunWebLink: p.urunWebLink,
    datasheetLink: p.datasheetLink,
    gorselUrl: p.gorselUrl,
    aciklama: p.aciklama,
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
