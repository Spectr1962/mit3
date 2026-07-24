import { api } from "~/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    ChevronRight,
    Home,
    Building,
    Calendar,
    Eye,
    Layers,
    CheckCircle2,
    TrendingUp,
    Target,
    Cpu
} from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function DetailCasePage({ params }: PageProps) {
    // 1. Асинхронно извлекаем slug согласно стандарту Next.js 15+
    const resolvedParams = await params;
    const currentSlug = resolvedParams.slug;

    if (!currentSlug) return notFound();

    // 2. Получаем детальные данные кейса из PostgreSQL через tRPC
    const project = await api.media.getBySlug({ slug: currentSlug });

    // Если кейс не найден или это обычная статья блога — отдаем 404
    if (!project || project.type !== "CASE_STUDY") return notFound();

    return (
        <div className="space-y-8 py-4 md:py-8 max-w-4xl mx-auto px-2">

            {/* ДИНАМИЧЕСКИЕ ХЛЕБНЫЕ КРОШКИ */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/40 p-2.5 px-4 backdrop-blur-sm rounded-xl border w-fit">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" /> Главная
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <Link href="/cases" className="hover:text-primary transition-colors">
                    Кейсы
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <span className="text-foreground font-semibold truncate max-w-[150px] md:max-w-none">
                    {project.title}
                </span>
            </nav>

            {/* ОГЛАВЛЕНИЕ И МЕТАДАННЫЕ ПРОЕКТА */}
            <div className="space-y-4">
                {project.service && (
                    <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 uppercase tracking-wider">
                        Интеграция {project.service.title}
                    </span>
                )}

                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                    {project.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-muted-foreground border-y py-4">
                    {project.clientName && (
                        <span className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary" /> Бренд: <strong className="text-foreground">{project.clientName}</strong>
                        </span>
                    )}
                    {project.duration && (
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Производство: <strong className="text-foreground">{project.duration}</strong>
                        </span>
                    )}
                    <span className="flex items-center gap-2 font-mono text-xs ml-auto">
                        <Eye className="h-4 w-4" /> Просмотров: {project.viewCount}
                    </span>
                </div>
            </div>

            {/* ИНТЕРАКТИВНЫЙ БЛОК МЕТРИК КЕЙСА (ВИЗУАЛЬНЫЙ АКЦЕНТ НА ЦИФРЫ) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Target className="h-5 w-5" /></div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Фокус</p>
                        <p className="text-xs md:text-sm font-bold text-foreground truncate max-w-[180px]">B2B Масштабирование</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500"><TrendingUp className="h-5 w-5" /></div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Результат</p>
                        <p className="text-xs md:text-sm font-bold text-green-500">Цели KPI достигнуты</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500"><Cpu className="h-5 w-5" /></div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Стек</p>
                        <p className="text-xs md:text-sm font-bold text-foreground font-mono">Next.js 15 / Docker</p>
                    </div>
                </div>
            </div>

            {/* ДЕКОРАТИВНАЯ ОБЛОЖКА (Сетка-паттерн в стиле платформы MIT3) */}
            <div className="aspect-video w-full rounded-2xl border bg-muted/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-50" />
                <div className="z-10 text-center space-y-2 p-4">
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto opacity-80" />
                    <p className="text-lg font-black tracking-tight text-foreground">{project.clientName}</p>
                    <p className="text-xs text-muted-foreground font-mono">Архив выполненных b2b-интеграций</p>
                </div>
            </div>

            {/* ТЕЛО КЕЙСА (Рендеринг Задач, Решений и Результатов из Базы Данных) */}
            <article className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {/* 
          Используем dangerouslySetInnerHTML, так как в seed.ts мы заложили 
          красивую HTML-разметку с тегами <h2>, чтобы b2b-кейс выглядел структурировано.
        */}
                <div
                    className="text-sm md:text-base space-y-6 
            prose-h2:text-xl prose-h2:font-black prose-h2:text-foreground prose-h2:pt-4 prose-h2:flex prose-h2:items-center
            prose-p:text-muted-foreground prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                />
            </article>

            {/* МАРКЕТИНГОВЫЙ КОНВЕРСИОННЫЙ БАННЕР СВЯЗКИ С УСЛУГОЙ */}
            {project.serviceId && project.service && (
                <div className="p-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 mt-10">
                    <div className="space-y-1">
                        <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" /> Необходим аналогичный рост показателей?
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Данное b2b-решение развернуто и кастомизировано в рамках нашего VIP-модуля <span className="font-semibold text-primary">{project.service.title}</span>.
                        </p>
                    </div>
                    <Link
                        href={`/services/${project.service.slug}`}
                        className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground text-center hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap block"
                    >
                        Изучить модуль {project.service.title}
                    </Link>
                </div>
            )}

            {/* КНОПКА ВОЗВРАТА */}
            <div className="pt-6 border-t flex justify-center md:justify-start">
                <Link href="/cases" className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Вернуться к архиву кейсов</span>
                </Link>
            </div>

        </div>
    );
}
