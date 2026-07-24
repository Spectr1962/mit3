import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Многостраничная T3 PWA Платформа",
        short_name: "T3Platform",
        description: "Услуги, медиацентр, портфолио кейсов и личный кабинет на T3-стеке",
        start_url: "/",
        display: "standalone", // Запуск в режиме отдельного приложения (без браузерной строки)
        background_color: "#ffffff",
        theme_color: "#020617", // Тёмный цвет для системных шапок PWA
        icons: [
            {
                src: "/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
