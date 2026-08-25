import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Цифровые PWA-хабы для бизнеса",
        short_name: "PWA Хаб",
        description: "Проектирование и разработка высокотехнологичных PWA-платформ нового поколения на Next.js.",
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#0f172a", // slate-900 в Tailwind (цвет фона при запуске)
        theme_color: "#0284c7",      // sky-600 в Tailwind (цвет панели управления)
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
