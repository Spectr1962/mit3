import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === "development",

    workboxOptions: {
        skipWaiting: true,
        runtimeCaching: [
            {
                // УНИВЕРСАЛЬНЫЙ ПАТТЕРН: Кэширует корень сайта (/) и любые b2b разделы
                urlPattern: /\/(?:services|cases|media|contacts)?(?:\/.*)?$/,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "mit3-pages-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // Храним страницы 30 дней
                    },
                },
            },
            {
                // Кэшируем шрифты, стили, картинки и скрипты сборки (загрузка за 0 мс)
                urlPattern: /\.(?:js|css|woff2|png|svg|ico|jpg|jpeg)$/,
                handler: "CacheFirst",
                options: {
                    cacheName: "mit3-assets-cache",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 60 * 24 * 60 * 60,
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
