import Link from "next/link";
import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const metadata: Metadata = {
    title: "Прайс-лист на услуги цифрового маркетинга",
    description:
        "Актуальные цены и сроки запуска по всем направлениям digital-маркетинга агентства mit3.",
};

export default async function PricingPage() {
    const categories = await api.service.getCategoriesWithServices();

    return (
        <div className="space-y-10">
            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Прайс-лист агентства
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                    Прозрачная стоимость стартовых форматов по каждому направлению.
                    Точная смета формируется после диагностики вашего проекта.
                </p>
            </div>

            {/* Таблица-прайс в карточке */}
            <Card>
                <CardHeader>
                    <CardTitle>Актуальный прайс-лист</CardTitle>
                    <CardDescription>
                        Точная стоимость фиксируется после обсуждения деталей вашей задачи
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{service.title}</span>
                                        <Badge variant="outline">{service.category.title}</Badge>
                                    </div>

                                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                                        <div className="text-right">
                                            <div className="font-bold">
                                                от {srv.priceFrom.toLocaleString("ru-RU")} ₽
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {srv.priceNote ?? srv.duration}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/contacts?service=${srv.slug}`}
                                            className={buttonVariants({ size: "sm" })}
                                        >
                                            Заказать
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
