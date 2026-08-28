import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

await prisma.user.upsert({
  where: { email: "admin@example.com" },
  update: { name: "Admin" },
  create: { email: "admin@example.com", name: "Admin" },
});

await prisma.$disconnect();
console.log("Seed complete.");
