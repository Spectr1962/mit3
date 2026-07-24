import Link from "next/link";
import { api } from "~/trpc/server";
import {
    BarChart3,
    Smartphone,
    Search,
    ShieldAlert,
    Video,
    Users,
    TrendingUp,
    ArrowUpRight,
    Home,
    ChevronRight
} from "lucide-react";

// Инкрементальная статическая регенерация (ISR) на 30 минут
export const revalidate = 1800;

const iconMap: Record<string, any> = {
    "analytics": BarChart3,
    "pwa": Smartphone,
    "seo": Search,
    "serm": ShieldAlert,
    "content": Video,
    "smm": Users,
    "cmo-cro": TrendingUp,
};

const bentoStyles: Record<string, string> = {
    "analytics": "md:col-span-2 md:row-span-1",
    "pwa": "md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/30",
    "seo": "md:col-span-1 md:row-span-1",
    "serm": "md:col-span-1 md:row-span-1",
    "content": "md:col-span-1 md:row-span-1",
    "smm": "md:col-span-1 md:row-span-1",
    "cmo-cro": "md:col-span-3 md:row-span-1",
};

async function ServicesMainPageContent() {
    let rootServices = [];

    try {
        rootServices = await api.services.getRootServices();
    } catch (error) {
        console.error("Ошибка получения услуг из базы данных:", error);
    }

    if (!rootServices || rootServices.length === 0) {
        return (
            <div className="p-8 border border-dashed rounded-2xl text-center space-y-4 max-w-md mx-auto">
                <p className="text-muted-foreground text-sm">База данных в Docker еще не наполнена услугами.</p>
                <p className="text-xs text-muted-foreground font-mono">Запустите в терминале: npx tsx prisma/seed.ts</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-4 md:py-8 max-w-6xl mx-auto px-2">

            {/* СТАТИЧЕСКИЕ ХЛЕБНЫЕ КРОШКИ ДЛЯ КОРНЯ КАТАЛОГА */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/40 p-2.5 px-4 backdrop-blur-sm rounded-xl border w-fit">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    <span>Главная</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <span className="text-foreground font-semibold">
                    Услуги
                </span>
            </nav>

            {/* Заголовок раздела */}
            <div className="space-y-3 text-left md:max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                    Матрица Экосистемы <span className="text-primary">MIT3</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    Упаковываем бизнес в неубиваемые PWA-платформы и выводим в поисковое доминирование.
                    Выберите интересующий модуль управления ростом.
                </p>
            </div>

            {/* Адаптивная сетка Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
                {rootServices.map((service) => {
                    const Icon = iconMap[service.slug] || BarChart3;
                    const gridClass = bentoStyles[service.slug] || "md:col-span-1 md:row-span-1";

                    return (
                        <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className={`group relative flex flex-col justify-between p-6 rounded-2xl border bg-card/50 hover:bg-card hover:border-primary/50 hover:shadow-[0_0_25px_rgba(var(--primary),0.1)] transition-all duration-300 overflow-hidden ${gridClass}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>

                            <div className="space-y-2 mt-auto">
                                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                    <h2 className="font-bold text-lg md:text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h2>
                                    <span className="text-xs font-mono font-semibold text-primary px-2 py-0.5 rounded bg-primary/5">
                                        {service.price ? `от ${Number(service.price).toLocaleString("ru-RU")} ₽` : "Тарифы"}
                                    </span>
                                </div>

                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>

                            <div className="absolute -inset-px bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                        </Link>
                    );
                })}
            </div>

        </div>
    );
}

export default ServicesMainPageContent;
