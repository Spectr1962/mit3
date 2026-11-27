"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Layers, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

interface ServiceItem {
    id: string;
    slug: string;
    title: string;
    description: string;
    priceFrom: number;
    priceNote: string | null;
    duration: string;
    isPopular: boolean;
}

interface CategoryWithServices {
    id: string;
    slug: string;
    title: string;
    shortDesc: string;
    services: ServiceItem[];
}

export function ServicesHub({
    categories,
}: {
    categories: CategoryWithServices[];
}) {
    const [query, setQuery] = useState("");
    const normalizedQuery = query.trim().toLowerCase();

    // Плоский список всех услуг для мгновенного поиска
    const allServices = categories.flatMap((cat) =>
        cat.services.map((srv) => ({
            ...srv,
            categorySlug: cat.slug,
            categoryTitle: cat.title,
        })),
    );

    const matchedServices = normalizedQuery
        ? allServices.filter(
            (srv) =>
                srv.title.toLowerCase().includes(normalizedQuery) ||
                srv.description.toLowerCase().includes(normalizedQuery) ||
                srv.categoryTitle.toLowerCase().includes(normalizedQuery),
        )
        : [];

    return (
        <div className="space-y-8">
            {/* Поисковая строка по всему каталогу */}
            <div className="relative max-w-2xl">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Найти услугу или направление (например: SEO, Reels, CRM, аудит)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-12 pr-10 pl-10 text-base"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Очистить поиск"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Режим 1: Вывод результатов живого поиска */}
            {normalizedQuery ? (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Найдено услуг: <span className="font-semibold text-foreground">{matchedServices.length}</span>
                    </p>

                    {matchedServices.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground">
                                По запросу «{query}» ничего не найдено. Попробуйте изменить формулировку или выберите направление ниже.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {matchedServices.map((srv) => (
                                <Link
                                    key={srv.id}
                                    href={`/services/${srv.categorySlug}/${srv.slug}`}
                                    className="group block"
                                >
                                    <Card className="h-full transition-colors group-hover:border-primary">
                                        <CardHeader className="pb-2">
                                            <div className="mb-1 flex items-center justify-between gap-2">
                                                <Badge variant="secondary">{srv.categoryTitle}</Badge>
                                                {srv.isPopular && <Badge>Хит</Badge>}
                                            </div>
                                            <CardTitle className="text-lg group-hover:text-primary">
                                                {srv.title}
                                            </CardTitle>
                                            <CardDescription>{srv.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="flex items-center justify-between pt-2 text-sm">
                                            <span className="font-bold">
                                                от {srv.priceFrom.toLocaleString("ru-RU")} ₽{" "}
                                                {srv.priceNote && (
                                                    <span className="font-normal text-muted-foreground">
                                                        {srv.priceNote}
                                                    </span>
                                                )}
                                            </span>
                                            <span className="inline-flex items-center gap-1 font-medium text-primary">
                                                Подробнее <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Режим 2: Сетка 11 направлений (Уровень 1 — Хаб) */
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => {
                        const minPrice =
                            cat.services.length > 0
                                ? Math.min(...cat.services.map((s) => s.priceFrom))
                                : null;

                        return (
                            <Link
                                key={cat.id}
                                href={`/services/${cat.slug}`}
                                className="group block"
                            >
                                <Card className="flex h-full flex-col justify-between transition-all group-hover:border-primary group-hover:shadow-sm">
                                    <CardHeader>
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Layers className="h-4 w-4" />
                                            </div>
                                            <Badge variant="outline">
                                                {cat.services.length}{" "}
                                                {cat.services.length === 1
                                                    ? "услуга"
                                                    : cat.services.length < 5
                                                        ? "услуги"
                                                        : "услуг"}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary">
                                            {cat.title}
                                        </CardTitle>
                                        <CardDescription className="pt-1">
                                            {cat.shortDesc}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardFooter className="flex items-center justify-between border-t pt-4 text-sm">
                                        {minPrice ? (
                                            <span className="font-semibold">
                                                от {minPrice.toLocaleString("ru-RU")} ₽
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">По запросу</span>
                                        )}
                                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                                            Открыть раздел <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </CardFooter>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
