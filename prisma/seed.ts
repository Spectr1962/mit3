import { PrismaClient, PostType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // Очищаем старые тестовые данные
    await prisma.activityLog.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.user.deleteMany({});

    // 1. Создаем системного автора для кейсов (Администратор)
    const admin = await prisma.user.create({
        data: {
            name: "Администратор MIT3",
            email: "admin@mit3.ru",
            password: "secure_password_here", // В продакшене использовать bcrypt хэш
            role: "ADMIN",
        },
    });

    console.log("Системный администратор создан.");

    // 2. Описываем 7 официальных VIP-услуг платформы
    const servicesData = [
        { key: "analytics", title: "MIT3.Analytics", desc: "Прозрачный контроль трафика, SEO и аптайма в реальном времени." },
        { key: "pwa", title: "MIT3.PWA", desc: "Разработка мобильных Web-платформ на Next.js 15." },
        { key: "seo", title: "MIT3.SEO", desc: "Поисковое доминирование в Яндексе и Google. Запуск автономного SEO-маховика." },
        { key: "serm", title: "MIT3.SERM", desc: "Управление репутацией и отзывами на картах и отзовиках." },
        { key: "content", title: "MIT3.Content", desc: "VIP-производство контента. Сценарии, Reels, Shorts и YouTube под ключ." },
        { key: "smm", title: "MIT3.SMM", desc: "Ежедневные прогревы и b2b-комьюнити. Превращаем читателей в лиды." },
        { key: "cmo-cro", title: "MIT3.CMO / CRO", desc: "Комплексное управление ростом. Директор по маркетингу на аутсорсе." },
    ];

    // Массив сохраненных в БД услуг для последующей привязки кейсов
    const createdServices: Record<string, string> = {};

    console.log("Наполнение 7 VIP-услуг MIT3...");
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

    // 3. Создаем 7 кейсов, покрывающих ключевые ниши под каждую услугу
    const casesData = [
        {
            title: "Интеграция сквозной аналитики для Финтех-платформы",
            slug: "analytics-fintech-case",
            summary: "Объединили данные CRM, мобильного трафика и рекламных кабинетов в единый дашборд реального времени.",
            content: "<h2>Задача</h2>Построить прозрачный трекинг стоимости лида (CAC) и окупаемости инвестиций (ROI) для крупного кредитного сервиса.<h2>Решение</h2>Развернули модуль MIT3.Analytics, интегрировали кастомные логгеры кликов и свели данные.<h2>Результат</h2>Сократили неэффективный рекламный бюджет на 24% в первый месяц.",
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
            content: "<h2>Задача</h2>Увеличить органический трафик интернет-магазина без роста затрат на контекстную рекламу.<h2>Решение</h2>Провели кластеризацию ядра, оптимизировали структуру категорий Next.js под краулинговые требования Яндекса и Google.<h2>Результат</h2>Органический трафик вырос в 4.5 раза за 6 месяцев.",
            clientName: "TrendShop Global",
            duration: "5 месяцев",
            serviceKey: "seo"
        },
        {
            title: "Вывод рейтинга сети медицинских клиник из 3.2 в 4.8 звезд",
            slug: "serm-medical-network",
            summary: "Перехватили и отработали негатив на гео-сервисах (Яндекс.Карты, 2ГИС) и профильных отзовиках.",
            content: "<h2>Задача</h2>Нейтрализовать атаку черного PR от конкурентов, обрушившую поток первичных пациентов.<h2>Решение</h2>Вдрили систему мотивации оставления белых отзывов через QR-коды, настроили автоматический мониторинг SERM.<h2>Результат</h2>Рейтинг восстановлен до 4.8, поток заявок вырос на 35%.",
            clientName: "Клиника Здоровья",
            duration: "2 месяца",
            serviceKey: "serm"
        },
        {
            title: "VIP-производство видеоконтента для Строительного холдинга",
            slug: "content-construction-case",
            summary: "Разработали сценарии и отсняли серию Reels/Shorts, собравшую суммарно более 3 000 000 органических просмотров.",
            content: "<h2>Задача</h2>Привлечь b2b-клиентов на покупку премиальной загородной недвижимости через соцсети.<h2>Решение</h2>Команда MIT3.Content разработала экспертные сценарии, провела съемки и оптимизировала алгоритмы дистрибуции видео.<h2>Результат</h2>Получено 118 квалифицированных лидов со средним чеком 25 млн руб.",
            clientName: "Девелопмент Групп",
            duration: "2 месяца",
            serviceKey: "content"
        },
        {
            title: "Построение B2B-комьюнити и прогревы для SaaS-сервиса автоматизации",
            slug: "smm-saas-automation",
            summary: "Превратили холодную аудиторию профессиональных каналов в лояльных платящих пользователей экосистемы.",
            content: "<h2>Задача</h2>Снизить стоимость привлечения клиента (CAC) в сложной b2b-нише IT-автоматизации.<h2>Решение</h2>Разработали контент-стратегию ежедневных прогревов, внедрили интерактивные b2b-механики в Telegram и VK.<h2>Результат</h2>Количество регистраций в сервисе увеличилось на 68% без увеличения медиабюджета.",
            clientName: "CloudProcess",
            duration: "3 месяца",
            serviceKey: "smm"
        },
        {
            title: "Масштабирование сети онлайн-школ: Директор по маркетингу на аутсорсе",
            slug: "cmo-cro-edtech",
            summary: "Комплексное управление ростом (CMO/CRO), перестройка воронки продаж и оптимизация конверсии на каждом этапе.",
            content: "<h2>Задача</h2>Преодолеть стагнацию выручки крупного EdTech-проекта.<h2>Решение</h2>Провели полный аудит сквозного пути клиента, пересобрали продуктовую матрицу,дрили A/B тестирование интерфейсов.<h2>Результат</h2>Выручка компании увеличилась в 2.1 раза за квартал, показатель оттока (Churn Rate) снижен на 15%.",
            clientName: "Академия Прогресса",
            duration: "4 месяца",
            serviceKey: "cmo-cro"
        }
    ];

    console.log("Наполнение кейсов портфолио...");
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
                // Связываем кейс с ID созданной ранее VIP-услуги
                serviceId: createdServices[c.serviceKey] || null,
            },
        });
    }

    console.log("База данных успешно синхронизирована! Залито: 7 услуг, 7 нишевых кейсов.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
