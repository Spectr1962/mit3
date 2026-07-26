import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",               // Папка, куда скомпилируется sw.js
    register: true,               // Автоматическая регистрация воркера на смартфонах
    reloadOnOnline: true,         // Автоперезагрузка страницы при восстановлении сети
    disable: process.env.NODE_ENV === "development", // Выключаем кэш на локалке для удобства разработки

    // Переносим расширенные параметры управления кэшем внутрь объекта workboxOptions
    workboxOptions: {
        skipWaiting: true,
    }
});

const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
