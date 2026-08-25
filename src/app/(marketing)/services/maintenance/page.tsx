export const dynamic = "force-dynamic";

import { db } from "~/server/db";
import { type TariffItem } from "~/types/services";

export default async function MaintenanceServicePage() {
    let service = null;
    let safeTariffs: TariffItem[] = [];

    try {
        // 1. Делаем безопасный запрос к базе данных
        service = await db.service.findUnique({
            where: { slug: "tech-maintenance" }, // Слаг для технической поддержки
            select: {
                titleH1: true,
                description: true,
                tariffs: true,
            }
        });

        if (service && service.tariffs) {
            // 2. Безопасное приведение типов для тарифов из JSON
            safeTariffs = service.tariffs as unknown as TariffItem[];
        }
    } catch (error) {
        console.error("База данных недоступна при сборке страницы Maintenance:", error);
    }

    // Заглушка для Docker-сборщика, чтобы билд не падал
    if (!service) {
        return (
            <main className="container mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold">Техническая поддержка и ведение</h1>
                <p className="text-muted-foreground mt-2">Страница находится в процессе синхронизации с базой данных.</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-black mb-4">{service.titleH1}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{service.description}</p>

            {/* Вывод тарифов на техподдержку */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {safeTariffs.map((tariff, index) => (
                    <div key={index} className="border p-6 rounded-2xl bg-card shadow-sm">
                        <h3 className="font-bold text-xl">{tariff.name}</h3>
                        <p className="text-lg font-semibold text-sky-600 mt-1">{tariff.price} руб.</p>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            {tariff.features.map((f, i) => <li key={i}>• {f}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    );
}
