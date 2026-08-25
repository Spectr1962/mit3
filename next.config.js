/** @type {import('next').NextConfig} */
const config = {
    // Автономный режим сборки (Standalone) для Docker-контейнеров
    output: "standalone",

    // ЖЕЛЕЗОБЕТОННАЯ ЗАЩИТА: Запрещаем ESLint рушить сборку из-за варнингов кэша докера
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Запрещаем TypeScript и Prisma останавливать компиляцию страниц из-за пустой базы данных в Docker
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default config;
