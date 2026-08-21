import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // Очищаем старые данные перед заполнением
    await prisma.lead.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.post.deleteMany({});

    // 1. Создаем базовые услуги маркетинга
    await prisma.service.createMany({
        data: [
            {
                title: "Создание PWA-сайта",
                slug: "pwa-development",
                description: "Разработка современных прогрессивных веб-приложений, работающих в офлайне и устанавливаемых на экран смартфона как нативные приложения без App Store.",
                priceFrom: "80 000 ₽",
            },
            {
                title: "SEO-оптимизация",
                slug: "seo-optimization",
                description: "Комплексное продвижение бизнеса в поисковых системах Яндекс и Google. Вывод запросов в ТОП-10 для привлечения бесплатного органического трафика.",
                priceFrom: "40 000 ₽",
            },
            {
                title: "SERM (Репутация бренда)",
                slug: "serm-reputation",
                description: "Мониторинг упоминаний компании, удаление и вытеснение негатива из поисковой выдачи, генерация положительных отзывов на картах и отзовиках.",
                priceFrom: "35 000 ₽",
            },
            {
                title: "Content-маркетинг",
                slug: "content-marketing",
                description: "Разработка контент-стратегии, написание экспертных статей, ведение блогов для прогрева аудитории и выстраивания максимального доверия к бренду.",
                priceFrom: "30 000 ₽",
            },
        ],
    });
    // 2. Создаем интересные статьи для блога
    await prisma.post.createMany({
        data: [
            {
                title: "Что такое PWA и почему вашему бизнесу пора отказаться от обычных сайтов",
                slug: "why-pwa-is-the-future",
                excerpt: "Разбираем главные преимущества прогрессивных приложений: автономность, скорость, работа в офлайне и установка на iOS/Android в обход App Store.",
                content: "Полный текст статьи про технологии PWA и особенности кэширования сервис-воркеров...",
                readTime: "4 мин",
            },
            {
                title: "Гайд по SERM: Как перекрыть плохие отзывы в Яндексе за 3 шага",
                slug: "serm-guide-2026",
                excerpt: "Пошаговая инструкция по работе с репутацией компании в сети. Как правильно мотивировать клиентов писать отзывы и удалять необоснованный негатив.",
                content: "Полный текст инструкции по работе с Яндекс.Картами, 2ГИС и популярными отзовиками...",
                readTime: "6 мин",
            },
        ],
    });

    console.log("🌱 Локальная база данных успешно наполнена контентом!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
