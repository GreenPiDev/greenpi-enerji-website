import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET tanimli degil");
const JWT_SECRET: string = process.env.JWT_SECRET;

const SESSION_TTL = "12h";

export function signAdminToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: SESSION_TTL });
}

export function verifyAdminToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
    return payload.role === "admin";
  } catch {
    return false;
  }
}
