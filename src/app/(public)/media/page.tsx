import Link from "next/link";
import { api } from "~/trpc/server";
import { PostType } from "@prisma/client";
import { Newspaper, Calendar, Eye, ChevronRight, Home, ArrowUpRight } from "lucide-react";

// Кэшируем страницу медиацентра на 15 минут (ISR)
export const revalidate = 900;

interface PageProps {
    searchParams: Promise<{ type?: string }>;
}

export default async function MediaPage({ searchParams }: PageProps) {
    // Асинхронно извлекаем GET-параметры фильтрации (Next.js 15+)
    const resolvedSearchParams = await searchParams;
    const currentType = resolvedSearchParams.type as PostType | undefined;

    // Запрашиваем публикации из базы данных Docker через tRPC, исключая кейсы портфолио
    const mediaFeed = await api.media.getInfiniteFeed({
        type: currentType ?? PostType.ARTICLE, // По умолчанию выводим статьи, если тип не задан
        limit: 20,
    });

    return (
        <div className="space-y-8 py-4 md:py-8 max-w-5xl mx-auto px-2">

            {/* ХЛЕБНЫЕ КРОШКИ */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/40 p-2.5 px-4 backdrop-blur-sm rounded-xl border w-fit">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    <span>Главная</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <span className="text-foreground font-semibold">
                    Медиацентр
                </span>
            </nav>

            {/* ЗАГОЛОВОК И ТАБЫ ФИЛЬТРАЦИИ */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6">
                <div className="space-y-3 max-w-xl">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-none">
                        Медиацентр <span className="text-primary">MIT3</span>
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Экспертная аналитика рынка, b2b-инсайды, новости экосистемы и практические руководства по масштабированию.
                    </p>
                </div>

                {/* Переключатель табов: Статьи / Новости (Умная навигация через GET-параметры) */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border w-fit text-xs font-semibold">
                    <Link
                        href="/media?type=ARTICLE"
                        className={`px-4 py-2 rounded-lg transition-all ${!currentType || currentType === "ARTICLE"
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Статьи и Блоги
                    </Link>
                    <Link
                        href="/media?type=NEWS"
                        className={`px-4 py-2 rounded-lg transition-all ${currentType === "NEWS"
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Новости компании
                    </Link>
                </div>
            </div>

            {/* ПОТОК ПУБЛИКАЦИЙ МЕДИAЦЕНТРА */}
            {mediaFeed.items.length === 0 ? (
                <div className="p-12 border border-dashed rounded-2xl text-center space-y-3 max-w-md mx-auto">
                    <Newspaper className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
                    <p className="text-muted-foreground text-sm">В данном разделе пока нет публикаций.</p>
                    <p className="text-xs text-muted-foreground font-mono">Добавьте статьи через админку или seed.ts</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {mediaFeed.items.map((article) => (
                        <Link
                            key={article.id}
                            href={`/media/${article.slug}`}
                            className="group block border rounded-2xl p-5 bg-card/40 hover:bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                {/* Левая часть: Иконка, Заголовок и Текст */}
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ru-RU") : "Недавно"}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5" /> {article.viewCount} просм.
                                        </span>
                                        <span>•</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${article.type === "NEWS" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                                            }`}>
                                            {article.type === "NEWS" ? "Новость" : "Блог"}
                                        </span>
                                    </div>

                                    <h2 className="font-bold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                                        {article.title}
                                    </h2>
                                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {article.summary}
                                    </p>
                                </div>

                                {/* Правая часть: Компактная стрелка-переход */}
                                <div className="p-2.5 rounded-xl border bg-muted/20 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all self-end sm:self-center">
                                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>
            )}

        </div>
    );
}
