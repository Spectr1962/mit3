import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // Путь к вашему клиенту Prisma

export const metadata = {
    title: 'Разработка PWA-систем и комплексный digital-маркетинг для бизнеса | Название',
    description: 'Создаем сверхбыстрые PWA-приложения на Next.js и обеспечиваем кратный рост продаж: SEO-продвижение, перформанс-маркетинг, сквозная аналитика и управление репутацией.',
};

export default async function HomePage() {
    // Вытаскиваем динамические данные для блоков портфолио и медиацентра прямо на сервере
    const [latestCases, latestPosts] = await Promise.all([
        prisma.case.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
        prisma.blogPost.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        })
    ]);

    // Список наших 8 главных направлений для блока услуг
    const mainServices = [
        { slug: 'site', title: 'Разработка PWA и сайтов' },
        { slug: 'seo', title: 'SEO-оптимизация' },
        { slug: 'performans-marketing', title: 'Перформанс-маркетинг' },
        { slug: 'analitics', title: 'Сквозная аналитика' },
        { slug: 'cmo-cro', title: 'CMO / CRO на аутсорсе' },
        { slug: 'smm', title: 'SMM-продвижение' },
        { slug: 'serm', title: 'Управление репутацией (SERM)' },
        { slug: 'content', title: 'Контент-маркетинг' },
    ];

    return (
        <div className="space-y-24 pb-20">
            {/* 1. HERO СЕКЦИЯ */}
            <section className="container mx-auto px-4 pt-16 md:pt-24 text-center max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                    Разработка сверхбыстрых <span className="text-primary">PWA-систем</span> и комплексный маркетинг
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                    Создаем автономные веб-приложения на Next.js и выводим бизнес в топ поисковых систем Яндекса и Google. Гарантируем результат по договору.
                </p>
                <Link href="/contacts" className="inline-block bg-primary text-white font-medium px-8 py-4 rounded-xl hover:bg-primary-hover transition shadow-lg shadow-primary/20">
                    Обсудить ваш проект
                </Link>
            </section>

            {/* 2. БЛОК УСЛУГ (Распределение веса на /services) */}
            <section className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Комплексные digital-решения для роста продаж</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainServices.map((service) => (
                        <div key={service.slug} className="border border-slate-100 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                                <p className="text-sm text-slate-500 mb-6">Решения бизнес-задач, автоматизация процессов и привлечение целевого трафика.</p>
                            </div>
                            <Link href={`/services/${service.slug}`} className="text-sm font-semibold text-primary hover:underline inline-flex items-center">
                                Услуги {service.title.toLowerCase()} &rarr;
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. ОТРАСЛЕВЫЕ РЕШЕНИЯ (Распределение веса на /solutions) */}
            <section className="bg-slate-50 py-16">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Готовые решения под вашу нишу бизнеса</h2>
                    <p className="text-slate-600 mb-10">Мы не пишем код с нуля. Используем 6 готовых b2b-шаблонов-трансформеров под специфику вашей отрасли, адаптируя систему под ваши задачи за 14 дней.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['medicine', 'construction', 'education', 'e-commerce'].map((niche) => (
                            <Link key={niche} href={`/solutions/${niche}`} className="bg-white border border-slate-200 px-6 py-3 rounded-xl font-medium text-slate-700 hover:border-primary hover:text-primary transition">
                                Маркетинг в {niche === 'medicine' ? 'медицине' : niche === 'construction' ? 'строительстве' : niche === 'education' ? 'обучении' : 'ритейле'}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. БЛОК ПОСЛЕДНИХ КЕЙСОВ */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Реальные результаты: наши кейсы</h2>
                    <Link href="/cases" className="text-primary font-semibold hover:underline mt-4 sm:mt-0">Смотреть все кейсы агентства &rarr;</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {latestCases.map((item) => (
                        <Link key={item.id} href={`/cases/${item.slug}`} className="group block border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                            <div className="p-6">
                                <span className="text-xs font-mono text-primary uppercase tracking-wider">{item.templateType} КЕЙС</span>
                                <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-primary transition">{item.title}</h3>
                            </div>
                        </Link>
                    ))}
                    {latestCases.length === 0 && (
                        <p className="text-slate-400 col-span-3 text-center py-8">Кейсы появятся сразу после наполнения базы данных.</p>
                    )}
                </div>
            </section>

            {/* 5. БЛОК СВЕЖИХ МАТЕРИАЛОВ ИЗ МЕДИАЦЕНТРА */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Свежие инсайты в Медиацентре</h2>
                    <Link href="/media" className="text-primary font-semibold hover:underline mt-4 sm:mt-0">Перейти в журнал &rarr;</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {latestPosts.map((post) => (
                        <Link key={post.id} href={`/media/${post.category.slug}/${post.slug}`} className="group block">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition">{post.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                        </map>
                    ))}
                    {latestPosts.length === 0 && (
                        <p className="text-slate-400 col-span-3 text-center py-8">Статьи появятся сразу после наполнения базы данных.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
