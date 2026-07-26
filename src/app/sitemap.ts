import { type MetadataRoute } from "next";
import { db } from "~/server/db";

// Кэшируем карту сайта на сервере (ISR)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Базовый URL вашей b2b платформы
    const baseUrl = "https://mit3.ru";

    // 1. Статические корневые маршруты платформы
    const staticRoutes = ["", "/services", "/cases", "/media", "/contacts", "/privacy", "/login", "/register"].map(
        (route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: route === "" ? 1.0 : 0.8,
        })
    );

    // 2. Динамические пути для 7 VIP-услуг MIT3
    const services = await db.service.findMany({ select: { slug: true, updatedAt: true } });
    const serviceRoutes = services.map((item) => ({
        url: `${baseUrl}/services/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    // 3. Динамические пути для Кейсов и Статей Медиацентра (Блога)
    const posts = await db.post.findMany({
        where: { isPublished: true },
        select: { slug: true, type: true, publishedAt: true },
    });

    const postRoutes = posts.map((item) => {
        // В зависимости от типа записи формируем правильный вложенный URL-адрес
        const folder = item.type === "CASE_STUDY" ? "cases" : "media";
        return {
            url: `${baseUrl}/${folder}/${item.slug}`,
            lastModified: item.publishedAt ?? new Date(),
            changeFrequency: "weekly" as const,
            priority: item.type === "CASE_STUDY" ? 0.7 : 0.6,
        };
    });

    // Объединяем статические и динамические адреса в единый XML массив для краулеров
    return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
