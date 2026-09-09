// Standard Next.js Prisma Client singleton: avoids exhausting DB connections
// from hot-reload creating a new PrismaClient on every edit in dev.
//
// Prisma 7's generated client requires an explicit driver adapter at
// runtime (it no longer bundles a query-engine binary) — for MariaDB that's
// @prisma/adapter-mariadb, constructed from DATABASE_URL.
import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis;

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
