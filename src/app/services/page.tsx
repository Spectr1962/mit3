import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { ServicesHub } from "~/components/ServicesHub";

export const metadata: Metadata = {
    title: "Услуги комплексного цифрового маркетинга",
    description:
        "Все направления digital-маркетинга в одном окне: стратегия и CMO, SEO, SERM, Performance-трафик, SMM, продакшн, CRM, аналитика и разработка PWA.",
};

export default async function ServicesHubPage() {
    const categories = await api.service.getCategoriesWithServices();

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Услуги и направления агентства
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                    Выберите нужное направление цифрового маркетинга или воспользуйтесь
                    поиском, чтобы быстро найти конкретную задачу и стоимость запуска.
                </p>
            </div>

            <ServicesHub categories={categories} />
        </div>
    );
}
