import crypto from "node:crypto";
import { prisma } from "../db";

export function cacheKey(tool: string, args: unknown) {
  const stable = JSON.stringify(args, Object.keys(args as any).sort());
  const raw = `${tool}:${stable}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function cacheGet<T>(key: string) {
  const row = await prisma.toolCache.findUnique({ where: { key } });
  if (!row) return null;
  if (new Date(row.ttl) < new Date()) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    // Backward compatibility if value is already a stringified JSON
    return row.value as unknown as T;
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number) {
  const expires = new Date(Date.now() + ttlSeconds * 1000);
  await prisma.toolCache.upsert({
    where: { key },
    create: { key, value: JSON.stringify(value), ttl: expires },
    update: { value: JSON.stringify(value), ttl: expires }
  });
}
