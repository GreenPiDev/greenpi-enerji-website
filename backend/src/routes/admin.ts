import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { productInclude, serializeProduct } from "../lib/serialize.js";
import { signAdminToken, verifyAdminToken } from "../lib/auth.js";
import { slugify } from "../lib/slug.js";
import { uploadMedia } from "../lib/cloudinary.js";

const COOKIE_NAME = "greenpi_admin";

const productInput = z.object({
  marka: z.string().min(1),
  urun: z.string().min(1),
  katalogLink: z.string().url().nullable().optional(),
  urunWebLink: z.string().url().nullable().optional(),
  datasheetLink: z.string().url().nullable().optional(),
  gorselUrl: z.string().nullable().optional(),
  aciklama: z.string().nullable().optional(),
  yayinda: z.boolean().optional(),
  lokasyonlar: z.array(z.string()).default([]),
  kategoriler: z.array(z.string()).default([]),
});

async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies[COOKIE_NAME];
  if (!token || !verifyAdminToken(token)) {
    reply.code(401).send({ error: "Yetkisiz" });
  }
}

export async function adminRoutes(app: FastifyInstance) {
  app.post<{ Body: { password?: string } }>("/admin/login", async (req, reply) => {
    const password = req.body?.password;
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash || !password || !(await bcrypt.compare(password, hash))) {
      return reply.code(401).send({ error: "Sifre yanlis" });
    }
    const token = signAdminToken();
    reply.setCookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return { ok: true };
  });

  app.post("/admin/logout", async (req, reply) => {
    reply.clearCookie(COOKIE_NAME, { path: "/" });
    return { ok: true };
  });

  app.get("/admin/me", { preHandler: requireAdmin }, async () => {
    return { ok: true };
  });

  app.post<{ Querystring: { folder?: string } }>(
    "/admin/upload",
    { preHandler: requireAdmin },
    async (req, reply) => {
      const folder = req.query.folder === "hero-videos" ? "hero-videos" : "product-images";
      const file = await req.file();
      if (!file) return reply.code(400).send({ error: "Dosya bulunamadi" });

      const buffer = await file.toBuffer();
      const url = await uploadMedia(buffer, file.mimetype, folder);
      return { url };
    }
  );

  app.get("/admin/products", { preHandler: requireAdmin }, async () => {
    const products = await prisma.product.findMany({
      include: productInclude,
      orderBy: [{ marka: "asc" }, { urun: "asc" }],
    });
    return products.map(serializeProduct);
  });

  app.post("/admin/products", { preHandler: requireAdmin }, async (req, reply) => {
    const parsed = productInput.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const data = parsed.data;

    const baseId = slugify(`${data.marka}-${data.urun}`);
    let id = baseId;
    let n = 1;
    while (await prisma.product.findUnique({ where: { id } })) {
      n += 1;
      id = `${baseId}-${n}`;
    }

    const created = await prisma.product.create({
      data: {
        id,
        marka: data.marka,
        urun: data.urun,
        katalogLink: data.katalogLink ?? null,
        urunWebLink: data.urunWebLink ?? null,
        datasheetLink: data.datasheetLink ?? null,
        gorselUrl: data.gorselUrl ?? null,
        aciklama: data.aciklama ?? null,
        yayinda: data.yayinda ?? true,
        lokasyonlar: { createMany: { data: data.lokasyonlar.map((locationId) => ({ locationId })) } },
        kategoriler: { createMany: { data: data.kategoriler.map((categoryId) => ({ categoryId })) } },
      },
      include: productInclude,
    });

    return serializeProduct(created);
  });

  app.put<{ Params: { id: string } }>(
    "/admin/products/:id",
    { preHandler: requireAdmin },
    async (req, reply) => {
      const parsed = productInput.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
      const data = parsed.data;
      const { id } = req.params;

      const exists = await prisma.product.findUnique({ where: { id } });
      if (!exists) return reply.code(404).send({ error: "Urun bulunamadi" });

      await prisma.$transaction([
        prisma.productLocation.deleteMany({ where: { productId: id } }),
        prisma.productCategory.deleteMany({ where: { productId: id } }),
        prisma.product.update({
          where: { id },
          data: {
            marka: data.marka,
            urun: data.urun,
            katalogLink: data.katalogLink ?? null,
            urunWebLink: data.urunWebLink ?? null,
            datasheetLink: data.datasheetLink ?? null,
            gorselUrl: data.gorselUrl ?? null,
            aciklama: data.aciklama ?? null,
            yayinda: data.yayinda ?? true,
            lokasyonlar: { createMany: { data: data.lokasyonlar.map((locationId) => ({ locationId })) } },
            kategoriler: { createMany: { data: data.kategoriler.map((categoryId) => ({ categoryId })) } },
          },
        }),
      ]);

      const updated = await prisma.product.findUniqueOrThrow({ where: { id }, include: productInclude });
      return serializeProduct(updated);
    }
  );

  app.delete<{ Params: { id: string } }>(
    "/admin/products/:id",
    { preHandler: requireAdmin },
    async (req, reply) => {
      const { id } = req.params;
      const exists = await prisma.product.findUnique({ where: { id } });
      if (!exists) return reply.code(404).send({ error: "Urun bulunamadi" });
      await prisma.product.delete({ where: { id } });
      return { ok: true };
    }
  );
}
