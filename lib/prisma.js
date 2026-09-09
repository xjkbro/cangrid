// Standard Next.js Prisma Client singleton: avoids exhausting DB connections
// from hot-reload creating a new PrismaClient on every edit in dev.
import { PrismaClient } from "./generated/prisma";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
