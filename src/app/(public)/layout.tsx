import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PublicPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased flex flex-col justify-between">
            {/* 1. ГЛОБАЛЬНАЯ ШАПКА ИЗ ВАШЕГО ПРОЕКТА */}
            <Header />

            {/* Контейнер для контента с автоматическим отступом под фиксированный Header */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 space-y-6 flex-1 flex flex-col justify-start">

                {/* ========================================================= */}
                {/* ОРИГИНАЛЬНЫЕ ХЛЕБНЫЕ КРОШКИ В ВАШЕМ СКВОЗНОМ LAYOUT */}
                {/* ========================================================= */}
                <div className="flex justify-start w-full relative z-30">
                    <nav className="inline-flex items-center gap-2 bg-zinc-50/90 backdrop-blur-md border border-zinc-200/80 px-4 py-2 rounded-full font-mono text-[9px] font-black uppercase tracking-widest text-zinc-400 shadow-sm">
                        <Link
                            href="/"
                            className="text-zinc-500 hover:text-indigo-600 transition-colors duration-150 touch-manipulation"
                        >
                            Главная
                        </Link>

                        <span className="text-zinc-300 font-normal select-none">//</span>

                        <Link
                            href="/services"
                            className="text-zinc-500 hover:text-indigo-600 transition-colors duration-150 touch-manipulation"
                        >
                            Каталог
                        </Link>
                    </nav>
                </div>

                {/* 2. ДИНАМИЧЕСКИЙ ВЫВОД ВАШИХ СТРАНИЦ (page.tsx) */}
                <main className="w-full">
                    {children}
                </main>
            </div>

            {/* 3. ГЛОБАЛЬНЫЙ ФУТЕР */}
            <Footer />
        </div>
    );
}
