import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma'; // Путь к вашему клиенту Prisma

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://site.ru';

    // 1. Статические страницы сайта (всегда доступны)
    const staticPages = [
        '',
        '/services',
        '/solutions',
        '/cases',
        '/media',
        '/about',
        '/about/team',
        '/about/awards',
        '/about/reviews',
        '/about/vacancies',
        '/contacts',
        '/privacy',
        '/terms'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8, // Главной странице максимальный приоритет
    }));

    try {
        // 2. Вытягиваем направления услуг (Например: /services/seo)
        const serviceCategories = await prisma.serviceCategory.findMany({ select: { slug: true, updatedAt: true } });
        const serviceCategoryUrls = serviceCategories.map((cat) => ({
            url: `${baseUrl}/services/${cat.slug}`,
            lastModified: cat.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        // 3. Вытягиваем конечные модули услуг (Например: /services/seo/technical-audit)
        const serviceModules = await prisma.serviceModule.findMany({
            select: { slug: true, updatedAt: true, category: { select: { slug: true } } }
        });
        const serviceModuleUrls = serviceModules.map((mod) => ({
            url: `${baseUrl}/services/${mod.category.slug}/${mod.slug}`,
            lastModified: mod.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        // 4. Вытягиваем главные ниши (Например: /solutions/medicine)
        const solutionCategories = await prisma.solutionCategory.findMany({ select: { slug: true, updatedAt: true } });
        const solutionCategoryUrls = solutionCategories.map((cat) => ({
            url: `${baseUrl}/solutions/${cat.slug}`,
            lastModified: cat.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        // 5. Вытягиваем направления бизнеса внутри ниш (Например: /solutions/medicine/stomatology)
        const solutionTargets = await prisma.solutionTarget.findMany({
            select: { slug: true, updatedAt: true, category: { select: { slug: true } } }
        });
        const solutionTargetUrls = solutionTargets.map((target) => ({
            url: `${baseUrl}/solutions/${target.category.slug}/${target.slug}`,
            lastModified: target.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        // 6. Вытягиваем кейсы (Например: /cases/kejs-seo-stomatologiya)
        const cases = await prisma.case.findMany({ select: { slug: true, updatedAt: true } });
        const caseUrls = cases.map((item) => ({
            url: `${baseUrl}/cases/${item.slug}`,
            lastModified: item.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        // 7. Вытягиваем статьи медиацентра (Например: /media/seo/kak-podnyat-trafik)
        const posts = await prisma.blogPost.findMany({
            select: { slug: true, updatedAt: true, category: { select: { slug: true } } }
        });
        const postUrls = posts.map((post) => ({
            url: `${baseUrl}/media/${post.category.slug}/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        }));

        // Объединяем все массивы ссылок в одну финальную карту сайта
        return [
            ...staticPages,
            ...serviceCategoryUrls,
            ...serviceModuleUrls,
            ...solutionCategoryUrls,
            ...solutionTargetUrls,
            ...caseUrls,
            ...postUrls,
        ];
    } catch (error) {
        console.error('Ошибка генерации sitemap, отдаем только статику:', error);
        return staticPages;
    }
}
