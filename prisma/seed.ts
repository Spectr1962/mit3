import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // Очищаем старые тестовые услуги
    await prisma.service.deleteMany({});

    // 7 официальных VIP-услуг платформы MIT3
    const rootServices = [
        { title: "MIT3.Analytics", slug: "analytics", desc: "Прозрачный контроль трафика, SEO и аптайма в реальном времени." },
        { title: "MIT3.PWA", slug: "pwa", desc: "Разработка мобильных Web-платформ на Next.js 15." },
        { title: "MIT3.SEO", slug: "seo", desc: "Поисковое доминирование в Яндексе и Google. Запуск автономного SEO-маховика." },
        { title: "MIT3.SERM", slug: "serm", desc: "Управление репутацией и отзывами на картах и отзовиках." },
        { title: "MIT3.Content", slug: "content", desc: "VIP-производство контента. Сценарии, Reels, Shorts и YouTube под ключ." },
        { title: "MIT3.SMM", slug: "smm", desc: "Ежедневные прогревы и b2b-комьюнити. Превращаем читателей в лиды." },
        { title: "MIT3.CMO / CRO", slug: "cmo-cro", desc: "Комплексное управление ростом. Директор по маркетингу на аутсорсе." },
    ];

    console.log("Начало наполнения базы данными 7 VIP-услуг MIT3...");

    for (const item of rootServices) {
        await prisma.service.create({
            data: {
                title: item.title,
                slug: item.slug,
                description: item.desc,
                parentId: null, // Верхний уровень
            },
        });
    }

    console.log("База данных успешно наполнена официальными услугами!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
