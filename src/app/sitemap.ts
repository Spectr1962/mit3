// Инструктируем Next.js генерировать карту сайта динамически при запросе поискового робота,
// чтобы билд в Docker не пытался стучаться в базу во время сборки образа.
export const dynamic = "force-dynamic";

import { type MetadataRoute } from "next";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";

    // 1. Статические страницы
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/services`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/mediacentr`,
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];

    try {
        // 2. Страницы услуг из базы данных
        const services = await db.service.findMany({
            select: { slug: true, updatedAt: true },
        });

        const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
            url: `${baseUrl}/services/${service.slug}`,
            lastModified: service.updatedAt,
            changeFrequency: "monthly",
            priority: 0.8,
        }));

        // 3. Статьи Медиацентра из базы данных
        const posts = await db.post.findMany({
            select: { slug: true, updatedAt: true },
        });

        const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
            url: `${baseUrl}/mediacentr/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: "weekly",
            priority: 0.7,
        }));

        return [...staticRoutes, ...serviceRoutes, ...postRoutes];
    } catch (error) {
        // Подстраховка: если база недоступна, возвращаем хотя бы статические роуты, чтобы билд никогда не падал
        console.error("Ошибка генерации динамического sitemap:", error);
        return staticRoutes;
    }
}
