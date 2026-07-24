import { api } from "~/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Home, Calendar, Eye, BookOpen, Share2 } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function DetailArticlePage({ params }: PageProps) {
    const resolvedParams = await params;
    const currentSlug = resolvedParams.slug;

    if (!currentSlug) return notFound();

    const article = await api.media.getBySlug({ slug: currentSlug });

    if (!article || article.type === "CASE_STUDY") return notFound();

    return (
        // Шаг 1: Расширяем главный контейнер до max-w-6xl, как на остальных страницах
        <div className="max-w-6xl mx-auto space-y-8 py-4 md:py-8 px-2 md:px-4">

            {/* ЦЕПОЧКА ХЛЕБНЫХ КРОШЕК (теперь стоит по общей широкой сетке) */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/40 p-2.5 px-4 backdrop-blur-sm rounded-xl border w-fit">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" /> Главная
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <Link href="/media" className="hover:text-primary transition-colors">
                    Медиацентр
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <span className="text-foreground font-semibold truncate max-w-[150px] md:max-w-none">
                    {article.title}
                </span>
            </nav>

            {/* ШАПКА МАТЕРИАЛА (крупный заголовок на всю ширину) */}
            <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                    {article.title}
                </h1>

                {/* Линейка метаданных растягивается по общей сетке */}
                <div className="flex items-center gap-6 text-xs md:text-sm text-muted-foreground font-mono border-y py-3.5">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary/70" />
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ru-RU") : "Недавно"}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" /> Просмотров: {article.viewCount}
                    </span>

                    <button className="flex items-center gap-1.5 ml-auto text-xs font-semibold text-primary hover:underline font-sans">
                        <Share2 className="h-4 w-4" /> Поделиться
                    </button>
                </div>
            </div>

            {/* Шаг 2: ТЕЛО СТАТЬИ сужаем до max-w-3xl для комфортного чтения, но сохраняем выравнивание по левому краю широкой сетки */}
            <article className="prose prose-slate dark:prose-invert max-w-3xl text-foreground/90">
                <div
                    className="text-sm md:text-base leading-relaxed space-y-6
            prose-h2:text-xl prose-h2:font-extrabold prose-h2:text-foreground prose-h2:mt-8 prose-h2:mb-4
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>

            {/* БЛОК ПОДПИСКИ (ограничиваем для красоты по ширине текста) */}
            <div className="p-6 border border-dashed rounded-2xl bg-muted/20 text-center space-y-4 max-w-3xl mt-10">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto text-primary">
                    <BookOpen className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-bold text-base text-foreground">Понравился b2b-материал?</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Зарегистрируйтесь в Личном кабинете, чтобы сохранять полезные статьи и отслеживать аналитику трафика.
                    </p>
                </div>
                <Link
                    href="/register"
                    className="inline-block rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                    Создать бесплатный аккаунт
                </Link>
            </div>

            {/* КНОПКА ВОЗВРАТА */}
            <div className="pt-4 border-t flex justify-center md:justify-start">
                <Link href="/media" className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Вернуться в ленту медиацентра</span>
                </Link>
            </div>

        </div>
    );
}
