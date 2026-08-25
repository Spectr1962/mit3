import { db } from "~/server/db";
import { type TariffItem } from "~/types/services";

export default async function DevelopmentServicePage() {
    // 1. Делаем безопасный запрос к базе
    const service = await db.service.findUnique({
        where: { slug: "pwa-digital-hub" },
        select: {
            titleH1: true,
            description: true,
            tariffs: true, // В базе это тип Json
        }
    });

    if (!service) return <div>Услуга не найдена</div>;

    // 2. БЕЗОПАСНОЕ ПРИВЕДЕНИЕ ТИПОВ (Линтер скажет спасибо!)
    const safeTariffs = service.tariffs as unknown as TariffItem[];

    return (
        <main className="container mx-auto p-8">
            <h1>{service.titleH1}</h1>
            <p>{service.description}</p>

            {/* Теперь мы можем абсолютно безопасно вызывать .map, типы строго определены */}
            <div className="grid grid-cols-2 gap-4 mt-8">
                {safeTariffs.map((tariff, index) => (
                    <div key={index} className="border p-4 rounded-xl">
                        <h3 className="font-bold text-xl">{tariff.name}</h3>
                        <p className="text-lg font-semibold text-sky-600">{tariff.price} руб.</p>
                        <ul className="mt-2 text-sm text-muted-foreground">
                            {tariff.features.map((f, i) => <li key={i}>• {f}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    );
}
