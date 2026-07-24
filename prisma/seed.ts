import { PrismaClient, PostType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Запуск глобального переопределения базы данных...");

    // Очищаем таблицы в строгом порядке реляционных связей
    await prisma.activityLog.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.user.deleteMany({});

    // 1. СОЗДАНИЕ СИСТЕМНОГО АВТОРА (ADMIN)
    const admin = await prisma.user.create({
        data: {
            name: "Игорь Ларионов",
            email: "admin@mit3.ru",
            password: "secure_password_here", // В продакшене обязательно хэшировать
            role: "ADMIN",
        },
    });
    console.log("✅ Администратор платформы успешно создан.");

    // 2. НАПОЛНЕНИЕ 7 ОФИЦИАЛЬНЫХ VIP-УСЛУГ MIT3
    const servicesData = [
        { key: "analytics", title: "MIT3.Analytics", desc: "Прозрачный контроль трафика, SEO и аптайма в реальном времени." },
        { key: "pwa", title: "MIT3.PWA", desc: "Разработка мобильных Web-платформ на Next.js 15." },
        { key: "seo", title: "MIT3.SEO", desc: "Поисковое доминирование в Яндексе и Google. Запуск автономного SEO-маховика." },
        { key: "serm", title: "MIT3.SERM", desc: "Управление репутацией и отзывами на картах и отзовиках." },
        { key: "content", title: "MIT3.Content", desc: "VIP-производство контента. Сценарии, Reels, Shorts и YouTube под ключ." },
        { key: "smm", title: "MIT3.SMM", desc: "Ежедневные прогревы и b2b-комьюнити. Превращаем читателей в лиды." },
        { key: "cmo-cro", title: "MIT3.CMO / CRO", desc: "Комплексное управление ростом. Директор по маркетингу на аутсорсе." },
    ];

    const createdServices: Record<string, string> = {};

    for (const item of servicesData) {
        const s = await prisma.service.create({
            data: {
                title: item.title,
                slug: item.key,
                description: item.desc,
                parentId: null,
            },
        });
        createdServices[item.key] = s.id;
    }
    console.log("✅ Матрица из 7 VIP-услуг успешно импортирована.");

    // 3. НАПОЛНЕНИЕ КЕЙСОВ ПОРТФОЛИО (CASE_STUDY)
    const casesData = [
        {
            title: "Интеграция сквозной аналитики для Финтех-платформы",
            slug: "analytics-fintech-case",
            summary: "Объединили данные CRM, мобильного трафика и рекламных кабинетов в единый дашборд реального времени.",
            content: "<h2>Задача</h2>Построить прозрачный трекинг стоимости лида (CAC) и окупаемости инвестиций (ROI).<h2>Решение</h2>Развернули модуль MIT3.Analytics.<h2>Результат</h2>Сократили неэффективный рекламный бюджет на 24% в первый месяц.",
            clientName: "FinTech Альянс",
            duration: "1.5 месяца",
            serviceKey: "analytics"
        },
        {
            title: "Разработка PWA-платформы для федеральной службы доставки еды",
            slug: "pwa-food-delivery-case",
            summary: "Создали неубиваемую Web-платформу на Next.js, полностью заменившую нативные приложения в App Store и Google Play.",
            content: "<h2>Задача</h2>Уйти от дорогой поддержки нативных приложений и повысить конверсию мобильных гостей.<h2>Решение</h2>Разработали PWA с поддержкой офлайн-кэширования меню и push-уведомлений.<h2>Результат</h2>Конверсия в заказ выросла на 42%, скорость загрузки интерфейса на 3G — 0.8 сек.",
            clientName: "Доставка Мигом",
            duration: "3 месяца",
            serviceKey: "pwa"
        },
        {
            title: "Поисковое доминирование для международного E-commerce бренда",
            slug: "seo-ecommerce-global",
            summary: "Запустили автономный SEO-маховик, выведя в ТОП-3 более 15 000 высокочастотных товарных запросов.",
            content: "<h2>Задача</h2>Увеличить органический трафик интернет-магазина без роста затрат.<h2>Решение</h2>Провели кластеризацию ядра, оптимизировали структуру категорий Next.js.<h2>Результат</h2>Органический трафик вырос в 4.5 раза за 6 месяцев.",
            clientName: "TrendShop Global",
            duration: "5 месяцев",
            serviceKey: "seo"
        }
    ];

    for (const c of casesData) {
        await prisma.post.create({
            data: {
                title: c.title,
                slug: c.slug,
                summary: c.summary,
                content: c.content,
                type: PostType.CASE_STUDY,
                isPublished: true,
                publishedAt: new Date(),
                clientName: c.clientName,
                duration: c.duration,
                authorId: admin.id,
                serviceId: createdServices[c.serviceKey] || null,
            },
        });
    }
    console.log("✅ Нишевые кейсы портфолио успешно импортированы.");

    // 4. НАПОЛНЕНИЕ МЕДИАЦЕНТРА (СТАТЬИ И НОВОСТИ)
    const articlesData = [
        {
            title: "Эволюция мобильного веба: Почему PWA вытесняет нативную разработку в 2026 году",
            slug: "pwa-vs-native-2026",
            summary: "Подробный b2b-разбор стоимости поддержки, скорости доставки фич и влияния PWA на краулинговый бюджет SEO.",
            content: "<h2>Главный b2b инсайд года</h2>Поддержка двух раздельных команд (iOS и Android) становится непозволительной роскошью для среднего бизнеса. Прогрессивные веб-приложения (PWA) обеспечивают 100% нативный UX, работают в офлайне и весят менее 2 Мб.<h2>Преимущества для SEO</h2>В отличие от приложений из App Store, контент PWA полностью открыт для индексации роботами Яндекса и Google.",
            type: PostType.ARTICLE
        },
        {
            title: "Что такое краулинговый бюджет и как заставить поисковых роботов любить ваш сайт",
            slug: "what-is-crawling-budget",
            summary: "Практическое руководство по технической оптимизации Next.js для мгновенного сканирования страниц роботами Google и Яндекс.",
            content: "<h2>Ограничение ресурсов роботов</h2>Поисковые роботы не могут сидеть на вашем сайте вечно. У них есть лимит страниц, который они сканируют за один заход.<h2>Как оптимизировать Next.js</h2>Использование динамических карт sitemap.xml, чистый вывод robots.txt и отсечение GET-параметров позволяет сфокусировать роботов только на продающих страницах услуг.",
            type: PostType.ARTICLE
        },
        {
            title: "Платформа MIT3 официально переходит на архитектуру Next.js 15 и Turbopack",
            slug: "mit3-platform-next15-upgrade",
            summary: "Новостное обновление экосистемы: скорость сборки пиковых страниц выросла в 6 раз, поддержка асинхронных серверных компонентов.",
            content: "<h2>Технологический рывок экосистемы</h2>Мы успешно завершили перевод ядра платформы на Next.js 15. Использование компилятора Turbopack на Rust позволило сократить время горячей перезагрузки HMR до рекордных 12 миллисекунд. Для клиентов это означает еще более быстрый отклик PWA-интерфейсов.",
            type: PostType.NEWS
        }
    ];

    for (const art of articlesData) {
        await prisma.post.create({
            data: {
                title: art.title,
                slug: art.slug,
                summary: art.summary,
                content: art.content,
                type: art.type,
                isPublished: true,
                publishedAt: new Date(),
                authorId: admin.id,
            },
        });
    }
    console.log("✅ Статьи и новости Медиацентра успешно импортированы.");

    console.log("🏁 Глобальный сидинг базы данных завершен. Все системы активны!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
