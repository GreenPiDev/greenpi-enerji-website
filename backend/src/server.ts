import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import { publicRoutes } from "./routes/public.js";
import { adminRoutes } from "./routes/admin.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: (process.env.CORS_ORIGIN ?? "").split(",").filter(Boolean),
  credentials: true,
});
await app.register(cookie);
await app.register(multipart, {
  limits: { fileSize: 100 * 1024 * 1024 },
});

await app.register(publicRoutes);
await app.register(adminRoutes);

app.get("/health", async () => ({ ok: true }));

const port = Number(process.env.PORT ?? 4100);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
