import Link from "next/link";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ArrowRight, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface ServiceDetailPageProps {
    params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({
    params,
}: ServiceDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const service = await api.service.getBySlug({ slug });

    if (!service) {
        return { title: "Услуга не найдена" };
    }

    return {
        title: `${service.title} — заказать от ${service.priceFrom.toLocaleString("ru-RU")} ₽`,
        description: service.description,
    };
}

export default async function ServiceDetailPage({
    params,
}: ServiceDetailPageProps) {
    const { category: categorySlug, slug } = await params;
    const service = await api.service.getBySlug({ slug });

    if (service?.category.slug !== categorySlug) {
        notFound();
    }

    return (
        <div className="space-y-10">
            {/* Полные хлебные крошки для пользователей и поисковиков */}
            <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                    Главная
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/services" className="hover:text-foreground">
                    Услуги
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link
                    href={`/services/${service.category.slug}`}
                    className="hover:text-foreground"
                >
                    {service.category.title}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-foreground">{service.title}</span>
            </nav>

            {/* Основная информация и карточка заказа */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Левая колонка: Описание и состав работ */}
                <div className="space-y-8 lg:col-span-2">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{service.category.title}</Badge>
                            {service.isPopular && <Badge>Популярный формат</Badge>}
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {service.title}
                        </h1>

                        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                            {service.fullContent ?? service.description}
                        </p>
                    </div>

                    {service.features.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold tracking-tight">
                                Что входит в работу
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                {service.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 rounded-xl border bg-card p-4"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                        <span className="text-sm sm:text-base">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Правая колонка: Стоимость, сроки и кнопка заявки */}
                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-lg">Стоимость и запуск</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="text-3xl font-bold">
                                    от {service.priceFrom.toLocaleString("ru-RU")} ₽
                                </div>
                                {service.priceNote && (
                                    <div className="text-sm text-muted-foreground">
                                        {service.priceNote}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>Срок реализации: {service.duration}</span>
                            </div>

                            <div className="space-y-2.5 pt-2">
                                <Link
                                    href={`/contacts?service=${service.slug}`}
                                    className={buttonVariants({
                                        size: "lg",
                                        className: "w-full gap-2",
                                    })}
                                >
                                    Оставить заявку
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <p className="text-center text-xs text-muted-foreground">
                                    Проведём первичный разбор задачи и подготовим смету в течение
                                    дня
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
