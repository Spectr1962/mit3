import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public", // Папка, куда соберется Service Worker
    register: true, // Автоматическая регистрация в браузере
    disable: process.env.NODE_ENV === "development", // Отключаем кэш в режиме разработки, чтобы код обновлялся сразу
});

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    output: "standalone", // <--- ОБЯЗАТЕЛЬНО ДОБАВЬ ЭТУ СТРОКУ ДЛЯ DEVOPS/DOCKER
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default withPWA(config);
