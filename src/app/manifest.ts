import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "mit3 — Агентство комплексного цифрового маркетинга",
        short_name: "mit3",
        description:
            "Комплексный digital-маркетинг для бизнеса: стратегия, лидогенерация, SEO, контент и разработка конверсионных PWA-платформ.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        icons: [
            {
                src: "/icon-192x192.png?v=2",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512x512.png?v=2",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
