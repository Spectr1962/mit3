import "dotenv/config";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const pool = new pg.Pool({ connectionString: databaseUrl });

await pool.query(`
  ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "login" TEXT,
    ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
    ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'user';

  CREATE UNIQUE INDEX IF NOT EXISTS "User_login_key"
    ON "User" ("login")
    WHERE "login" IS NOT NULL;
`);

await pool.end();
console.log("Auth database schema is ready.");
