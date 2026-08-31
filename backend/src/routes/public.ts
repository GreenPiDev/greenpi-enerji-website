import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { productInclude, serializeProduct } from "../lib/serialize.js";

export async function publicRoutes(app: FastifyInstance) {
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
}
