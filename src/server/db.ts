import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const pool = new PrismaPg({ connectionString: env.DATABASE_URL ?? "" });

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: pool,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
