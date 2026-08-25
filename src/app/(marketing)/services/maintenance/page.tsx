import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Техническая поддержка, ведение и развитие сайтов",
    description: "Обеспечиваем бесперебойную работу, масштабирование ИТ-инфраструктуры, обновление контента и безопасность ваших веб-решений.",
};

export default function MaintenanceServicePage() {
    return (
        <main className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-4">Поддержка и ведение проектов</h1>
            <p className="text-muted-foreground">Администрирование, развитие и регулярное обновление вашего цифрового продукта.</p>
        </main>
    );
}
