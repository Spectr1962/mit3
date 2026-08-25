import { type MetadataRoute } from "next";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Автоматически определяем базовый URL сайта из переменных окружения или ставим дефолт
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";

    // 1. Статические страницы вашего сайта (Главная и главные хабы)
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            changeFrequency: "daily", // Так как новости из Медиацентра выводятся на главную каждый день
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

    // 2. Динамические страницы услуг из базы данных Prisma
    const services = await db.service.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    });

    const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updatedAt, // Поисковики увидят, когда вы обновили цену или тарифы
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    // 3. Динамические статьи и кейсы Медиацентра (Ваш главный ежедневный локомотив)
    const posts = await db.post.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    });

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/mediacentr/${post.slug}`,
        lastModified: post.updatedAt, // Робот сразу поймет, если вы обновили или дополнили старый кейс
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // Объединяем все роуты в одну большую карту сайта для Яндекса и Google
    return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
