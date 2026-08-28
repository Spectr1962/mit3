import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const login = process.env.AUTH_ADMIN_LOGIN?.trim();
const password = process.env.AUTH_ADMIN_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

if (!login || !password || !databaseUrl) {
  throw new Error(
    "DATABASE_URL, AUTH_ADMIN_LOGIN and AUTH_ADMIN_PASSWORD are required",
  );
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });
const passwordHash = await bcrypt.hash(password, 12);
const email = login.includes("@") ? login : undefined;
const existingUser = email
  ? await prisma.user.findUnique({ where: { email } })
  : await prisma.user.findUnique({ where: { login } });

if (existingUser) {
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { login, passwordHash, role: "admin", name: login, email },
  });
} else {
  await prisma.user.create({
    data: { login, passwordHash, role: "admin", name: login, email },
  });
}

await prisma.$disconnect();
console.log(`Admin user '${login}' is ready.`);
