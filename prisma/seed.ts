import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Очистка базы данных перед заполнением...");

    // Безопасно очищаем новые таблицы в правильном порядке (от дочерних к родительским)
    await prisma.module.deleteMany({});
    await prisma.faqItem.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.category.deleteMany({});

    console.log("✅ База данных успешно подготовлена к наполнению через админку!");
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
