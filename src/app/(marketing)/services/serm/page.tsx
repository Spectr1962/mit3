import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Управление репутацией (SERM) бизнеса в сети под ключ",
    description: "Формируем положительный имидж бренда, вытесняем негатив из ТОП-10 Яндекса и Google, настраиваем работу с отзывами на картах и отзовиках.",
};

export default function SermServicePage() {
    return (
        <main className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-4">Управление репутацией (SERM)</h1>
            <p className="text-muted-foreground">Защита вашего бренда и управление отзывами в поисковых системах.</p>
        </main>
    );
}
