import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DATABASE_URL,
    },
    // ДОБАВЛЯЕМ СЕКЦИЮ ДЛЯ PRISMA V7:
    migrations: {
        seed: 'tsx prisma/seed.ts',
    },
})
