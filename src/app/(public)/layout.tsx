import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";
import { Navbar } from "~/components/layout/navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col bg-background antialiased text-foreground">
            {/* Шапка (ПК / Кнопка установки на мобилках) */}
            <Header />

            {/* 
        Основной контейнер:
        pb-20 на мобилках защищает нижнюю часть страниц от перекрытия меню.
        md:pb-0 убирает этот отступ на мониторах компьютеров.
      */}
            <main className="flex-1 pb-20 md:pb-0 container mx-auto px-4 py-6 md:py-8">
                {children}
            </main>

            {/* Большой подвал (Только для ПК) */}
            <Footer />

            {/* Нижний таб-бар (Только для мобильных) */}
            <Navbar />
        </div>
    );
}
