import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { productInclude, serializeProduct } from "../lib/serialize.js";

const STATIC_PAGES = ["", "/about", "/solutions", "/products", "/contact"];

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });
}

export async function publicRoutes(app: FastifyInstance) {
  app.get("/sitemap.xml", async (_req, reply) => {
    const siteUrl = (process.env.FRONTEND_URL ?? "https://greenpi.com.tr").replace(/\/$/, "");

    const products = await prisma.product.findMany({
      where: { yayinda: true },
      select: { id: true },
    });

    const urls = [
      ...STATIC_PAGES.map((path) => `${siteUrl}${path}`),
      ...products.map((p) => `${siteUrl}/products/${p.id}`),
    ];

    const body = urls
      .map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`)
      .join("\n");

    reply.header("Content-Type", "application/xml; charset=utf-8");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
  });

  app.get("/api/locations", async () => {
    return prisma.location.findMany({ orderBy: { sira: "asc" } });
  });

  app.get("/api/categories", async () => {
    return prisma.category.findMany({ orderBy: { sira: "asc" } });
  });

  app.get<{ Querystring: { lokasyon?: string; kategori?: string } }>(
    "/api/products",
    async (req) => {
      const { lokasyon, kategori } = req.query;

      const products = await prisma.product.findMany({
        where: {
          yayinda: true,
          ...(lokasyon ? { lokasyonlar: { some: { locationId: lokasyon } } } : {}),
          ...(kategori ? { kategoriler: { some: { categoryId: kategori } } } : {}),
        },
        include: productInclude,
        orderBy: [{ marka: "asc" }, { urun: "asc" }],
      });

      return products.map(serializeProduct);
    }
  );

  app.post<{ Params: { id: string } }>("/api/products/:id/view-summary", async (req, reply) => {
    try {
      await prisma.product.update({
        where: { id: req.params.id },
        data: { ozetGoruntulemeSayisi: { increment: 1 } },
      });
    } catch {
      return reply.code(404).send({ error: "Ürün bulunamadı" });
    }
    return { ok: true };
  });

  app.post<{ Params: { id: string } }>("/api/products/:id/view-detail", async (req, reply) => {
    try {
      await prisma.product.update({
        where: { id: req.params.id },
        data: { detayGoruntulemeSayisi: { increment: 1 } },
      });
    } catch {
      return reply.code(404).send({ error: "Ürün bulunamadı" });
    }
    return { ok: true };
  });
}
