import { api } from "~/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, CreditCard, ChevronRight, Home, Layers } from "lucide-react";

interface PageProps {
    params: Promise<{
        slug: string[]; // Массив путей, например ["pwa", "web-apps"]
    }>;
}

export default async function ServiceCategoryPage({ params }: PageProps) {
    // 1. Асинхронно извлекаем массив slug-параметров (Next.js 15+)
    const resolvedParams = await params;
    const slugArray = resolvedParams.slug;

    // Берем последний элемент для поиска текущего уровня в PostgreSQL
    const currentSlug = slugArray[slugArray.length - 1];

    if (!currentSlug) return notFound();

    // 2. Получаем текущую услугу с её родительским и дочерними уровнями через tRPC
    const service = await api.services.getBySlug({ slug: currentSlug });

    if (!service) return notFound();

    return (
        <div className="space-y-8 py-4 md:py-8 max-w-4xl mx-auto px-2">

            {/* ИДЕАЛЬНАЯ СКВОЗНАЯ ЦЕПОЧКА ХЛЕБНЫХ КРОШЕК */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/40 p-2.5 px-4 backdrop-blur-sm rounded-xl border w-fit">
                {/* Шаг 1: Главная */}
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" /> Главная
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />

                {/* Шаг 2: Услуги (заменили матрицу) */}
                <Link href="/services" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" /> Услуги
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />

                {/* Шаг 3: Динамический родительский уровень (если есть) */}
                {service.parent && (
                    <>
                        <Link href={`/services/${service.parent.slug}`} className="hover:text-primary transition-colors max-w-[120px] md:max-w-none truncate">
                            {service.parent.title}
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                    </>
                )}

                {/* Шаг 4: Текущая активная страница */}
                <span className="text-foreground font-semibold truncate max-w-[140px] md:max-w-none">
                    {service.title}
                </span>
            </nav>

            {/* ГЛАВНЫЙ БЛОК ОПИСАНИЯ УСЛУГИ */}
            <div className="space-y-4 border-b pb-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                    {service.title}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                    {service.description}
                </p>
            </div>

            {/* ВЫВОД ПОДКАТЕГОРИЙ (Уровни 2 и 3) */}
            {service.children && service.children.length > 0 ? (
                <div className="space-y-4">
                    <h2 className="font-bold text-lg md:text-xl text-foreground">Доступные модули управления:</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.children.map((child) => (
                            <Link
                                key={child.id}
                                // Формируем чистую иерархическую вложенность ссылок
                                href={`/services/${slugArray.join("/")}/${child.slug}`}
                                className="p-5 border rounded-2xl bg-card/50 hover:bg-card hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between h-36"
                            >
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base group-hover:text-primary transition-colors text-foreground">
                                        {child.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {child.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-xs font-medium text-primary mt-2">
                                    <span>Узнать больше</span>
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                // БЛОК ОФОРМЛЕНИЯ ЗАКАЗА (Если это финальный уровень вложенности)
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="md:col-span-2 p-6 border rounded-2xl bg-card space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-primary" /> Технический стек интеграции
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                В стоимость включена полная аналитика, развертывание в изолированном Docker-контейнере,
                                сквозное логирование действий и оптимизация под нативные PWA-функции мобильных устройств.
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4 mt-4">
                            <div className="space-y-0.5">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Стоимость модуля</span>
                                <div className="text-2xl font-black text-primary font-mono">
                                    {service.price ? `${Number(service.price).toLocaleString("ru-RU")} ₽` : "Договорная"}
                                </div>
                            </div>

                            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                                <CreditCard className="h-4 w-4" />
                                <span>Заказать интеграцию</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 border border-dashed rounded-2xl bg-muted/20 space-y-4 text-xs text-muted-foreground">
                        <p className="font-bold text-foreground text-sm">Гарантии MIT3:</p>
                        <ul className="space-y-2.5 list-none pl-0">
                            <li className="flex items-start gap-2">🔹 Поддержка работы в офлайн-режиме (PWA Cache)</li>
                            <li className="flex items-start gap-2">🔹 Полное соответствие требованиям SEO и Lighthouse</li>
                            <li className="flex items-start gap-2">🔹 Моментальная скорость загрузки через Next.js 15</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* КНОПКА НАЗАД */}
            <div className="pt-6">
                <Link href="/services" className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Вернуться во все услуги</span>
                </Link>
            </div>

        </div>
    );
}
