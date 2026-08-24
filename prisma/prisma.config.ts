import { defineConfig } from '@prisma/sdk';

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL, // ⬅️ Здесь мы передаем нашу переменную окружения для работы приложения
    },
});
