import type { MetadataRoute } from "next";
import { db } from "~/server/db";

export const revalidate = 43200;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://mit3.ru";
  const staticRoutes = [
    "",
    "/about",
    "/contacts",
    "/services",
    "/media",
    "/media/news",
    "/media/portfolio",
    "/media/promos",
    "/media/articles",
  ];
  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    const [services, directions, articles, mediaEntries] = await Promise.all([
      db.service.findMany({ select: { id: true, updatedAt: true, category: { select: { slug: true, direction: { select: { slug: true } } } } } }),
      db.direction.findMany({ select: { slug: true, updatedAt: true } }),
      db.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true, direction: { select: { slug: true } } } }),
      db.mediaEntry.findMany({ where: { published: true }, select: { id: true, type: true, updatedAt: true } }),
    ]);

    return [
      ...staticEntries,
      ...directions.map((direction) => ({ url: `${baseUrl}/services/${direction.slug}`, lastModified: direction.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
      ...services.map((service) => ({ url: `${baseUrl}/services/${service.category.direction.slug}/${service.category.slug}/${service.id}`, lastModified: service.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
      ...articles.map((article) => ({ url: `${baseUrl}/media/articles/${article.direction?.slug ?? "general"}/${article.slug}`, lastModified: article.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
      ...mediaEntries.map((entry) => ({ url: `${baseUrl}/media/${entry.type === "promo" ? "promos" : entry.type}/${entry.id}`, lastModified: entry.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
    ];
  } catch {
    return staticEntries;
  }
}