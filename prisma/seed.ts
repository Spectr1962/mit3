import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("=== Старт сидирования базы данных ===");

    // 1. Безопасно очищаем новые коммерческие таблицы в правильном порядке
    // Сначала удаляем дочерние (услуги и статьи), затем родительские (секторы), чтобы не нарушить связи
    await prisma.post.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.serviceSector.deleteMany({});

    console.log("✔ Старые таблицы каталога и Медиацентра успешно очищены.");

    // 2. Создаем базовое направление: Разработка PWA
    const devSector = await prisma.serviceSector.create({
        data: {
            slug: "development",
            name: "Разработка PWA и сайтов",
            shortDesc: "Проектирование высокотехнологичных цифровых хабов нового поколения вместо устаревших сайтов на конструкторах и CMS.",
            icon: "Code2",
            priority: 10,
        },
    });

    // 3. Создаем базовую услугу: Проектирование цифровых хабов
    await prisma.service.create({
        data: {
            slug: "pwa-digital-hub",
            name: "Цифровые PWA-платформы под ключ",
            titleH1: "Проектирование и разработка цифровых PWA-хабов для бизнеса",
            description: "Создаем отказоустойчивые веб-приложения на Next.js (T3 Stack). Установка на экран смартфона в 1 клик, бесплатные Push-уведомления вместо дорогих SMS и полноценный Offline-режим.",
            metaTitle: "Разработка цифровых PWA хабов на Next.js под ключ",
            metaDesc: "Заказать проектирование и разработку PWA платформ для бизнеса. Бесплатные пуши, высокая скорость загрузки, работа без интернета.",
            keywords: "pwa, разработка хабов, создание сайтов, nextjs, t3 stack, автоматизация бизнеса",
            priceFrom: 120000,
            currency: "RUB",

            // Наполняем JSON поля базовой валидной структурой (массивы объектов)
            features: JSON.stringify([
                "Установка на экран смартфона без AppStore и GooglePlay",
                "Бесплатные мгновенные Push-уведомления для клиентов",
                "Полноценная работа приложения без интернета (Offline-режим)"
            ]),
            tariffs: JSON.stringify([
                {
                    name: "Бизнес-Старт",
                    price: 120000,
                    features: ["PWA-оболочка", "Базовый личный кабинет", "Интеграция с 1 CRM"]
                },
                {
                    name: "Цифровой Комбайн",
                    price: 250000,
                    features: ["Offline-режим", "Push-рассылки", "Синхронизация с МИС/1С", "Умный бриф"]
                }
            ]),
            faq: JSON.stringify([
                {
                    q: "Будет ли PWA-хаб работать без интернета?",
                    a: "Да, благодаря кэшированию сервис-воркеров Next.js, основные разделы хаба, каталоги и личные кабинеты доступны пользователям полностью офлайн."
                }
            ]),
            sectorId: devSector.id,
        },
    });

    console.log("✔ База данных успешно наполнена стартовым SEO-контентом!");
    console.log("=== Сидирование успешно завершено ===");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Ошибка при сидировании базы данных:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
