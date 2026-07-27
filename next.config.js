import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",               // Папка, куда скомпилируется sw.js
    register: true,               // Автоматическая регистрация воркера на смартфонах
    reloadOnOnline: true,         // Автоперезагрузка страницы при восстановлении сети
    disable: process.env.NODE_ENV === "development", // Выключаем кэш на локалке для удобства разработки

    // Внутри workboxOptions настраиваем правила сохранения страниц в память смартфона
    workboxOptions: {
        skipWaiting: true,
        runtimeCaching: [
            {
                // 1. Кэшируем страницы каталога услуг, кейсов, блогов и контактов
                urlPattern: /\/(?:services|cases|media|contacts)(?:\/.*)?$/,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "mit3-pages-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // Храним посещенные страницы 30 дней
                    },
                },
            },
            {
                // 2. Кэшируем шрифты, стили, картинки и скрипты сборки (загрузка за 0 мс)
                urlPattern: /\.(?:js|css|woff2|png|svg|ico|jpg|jpeg)$/,
                handler: "CacheFirst",
                options: {
                    cacheName: "mit3-assets-cache",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 60 * 24 * 60 * 60, // Храним ассеты 60 дней
                    },
                },
            }
        ]
    }
});

const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
