import Link from "next/link";
import { api } from "~/trpc/server";
import {
    Briefcase,
    Calendar,
    Building,
    ChevronRight,
    Home,
    ArrowUpRight,
    TrendingUp,
    Award,
    Clock
} from "lucide-react";

// Инкрементальная статическая регенерация (ISR) на 30 минут
export const revalidate = 1800;

export default async function CasesPage() {
    // Запрашиваем 7 наших нишевых кейсов из базы данных Docker PostgreSQL через tRPC
    const portfolioCases = await api.media.getInfiniteFeed({
        type: "CASE_STUDY",
        limit: 20,
    });

    const cases = portfolioCases.items;

    // Отделяем первый самый главный кейс для создания крупной Hero-карточки
    const heroCase = cases[0];
    const gridCases = cases.slice(1);

    return (
        <div className="space-y-10 py-4 md:py-8 max-w-6xl mx-auto px-2">

            {/* ХЛЕБНЫЕ КРОШКИ */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/40 p-2.5 px-4 backdrop-blur-sm rounded-xl border w-fit">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    <span>Главная</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <span className="text-foreground font-semibold">
                    Кейсы
                </span>
            </nav>

            {/* ЗАГОЛОВОК И СТАТИСТИКА ПЛАТФОРМЫ */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-none">
                        Архив Достижений <span className="text-primary">MIT3</span>
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Мы не просто пишем код — мы перестраиваем бизнес-модели. Реальные цифры,
                        жесткие b2b-вызовы и результаты интеграции 7 VIP-модулей экосистемы.
                    </p>
                </div>

                {/* Быстрые b2b счетчики достижений для солидности */}
                <div className="flex gap-4 border p-4 rounded-2xl bg-card/30 backdrop-blur-sm text-xs font-medium">
                    <div className="px-2">
                        <p className="text-muted-foreground">Проектов в ТОП</p>
                        <p className="text-xl font-black text-primary font-mono">&gt;15 000</p>
                    </div>
                    <div className="border-l px-4">
                        <p className="text-muted-foreground">Ср. рост конверсии</p>
                        <p className="text-xl font-black text-green-500 font-mono">+42%</p>
                    </div>
                </div>
            </div>

            {/* ЕСЛИ БАЗА ДАННЫХ ПУСТА */}
            {cases.length === 0 && (
                <div className="p-12 border border-dashed rounded-2xl text-center space-y-3 max-w-md mx-auto">
                    <Briefcase className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
                    <p className="text-muted-foreground text-sm">Кейсы еще не синхронизировались.</p>
                    <p className="text-xs text-muted-foreground font-mono">Запустите в терминале: npx tsx prisma/seed.ts</p>
                </div>
            )}

            {/* СЕТКА BENTO SHOWCASE */}
            {cases.length > 0 && (
                <div className="space-y-6">

                    {/* 1. ГЛАВНЫЙ HERO-КЕЙС (На всю ширину экрана) */}
                    {heroCase && (
                        <Link
                            href={`/cases/${heroCase.slug}`}
                            className="group relative block w-full border rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card/80 to-primary/5 hover:border-primary/40 hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">

                                {/* Левая часть: Описание и Текст */}
                                <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-between space-y-6 order-2 lg:order-1">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold font-mono uppercase tracking-wider">
                                                <Award className="h-3.5 w-3.5" /> Флагманский проект
                                            </span>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                                            {heroCase.title}
                                        </h2>
                                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-4">
                                            {heroCase.summary}
                                        </p>
                                    </div>

                                    {/* Мета-панель Hero-карточки */}
                                    <div className="flex items-center justify-between border-t pt-6 flex-wrap gap-4">
                                        <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5 text-primary" /> {heroCase.clientName}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {heroCase.duration}</span>
                                        </div>
                                        <div className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                                            Разбор кейса <ArrowUpRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Правая часть: Огромная графическая заглушка-обложка */}
                                <div className="lg:col-span-3 aspect-video lg:aspect-auto border-b lg:border-b-0 lg:border-l bg-muted/30 relative overflow-hidden order-1 lg:order-2 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-60" />
                                    <TrendingUp className="h-28 w-28 text-primary/5 absolute -bottom-4 -right-4 stroke-1 transform rotate-12 group-hover:scale-110 transition-transform duration-500" />

                                    <div className="z-10 text-center p-4">
                                        <span className="text-7xl font-black text-primary/10 tracking-widest font-mono select-none block group-hover:scale-102 transition-transform">
                                            MIT3
                                        </span>
                                        {heroCase.service && (
                                            <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest border border-primary/30 rounded-full px-3 py-1 bg-background text-primary font-mono shadow-sm">
                                                Интеграция {heroCase.service.title}
                                            </span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </Link>
                    )}

                    {/* 2. ОСТАЛЬНЫЕ КЕЙСЫ (Сетка Bento из 2-х колонок) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gridCases.map((project) => (
                            <Link
                                key={project.id}
                                href={`/cases/${project.slug}`}
                                className="group flex flex-col justify-between p-6 rounded-3xl border bg-card/40 hover:bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300 min-h-[220px]"
                            >
                                {/* Шапка карточки */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <span className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5">
                                            <Building className="h-3.5 w-3.5 text-primary/60" /> {project.clientName}
                                        </span>

                                        {project.service && (
                                            <span className="text-[10px] font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                {project.service.title}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-lg md:text-xl tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>
                                </div>

                                {/* Описание */}
                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed my-3">
                                    {project.summary}
                                </p>

                                {/* Подвал карточки */}
                                <div className="flex items-center justify-between border-t pt-4 text-xs font-medium text-muted-foreground mt-auto">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" /> Срок: {project.duration}
                                    </span>
                                    <span className="inline-flex items-center gap-0.5 text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                                        Смотреть решение <ChevronRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
}
