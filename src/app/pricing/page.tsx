import Link from "next/link";
import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Breadcrumbs } from "~/components/shared/Breadcrumbs";

export const metadata: Metadata = {
    title: "Прайс-лист на услуги цифрового маркетинга",
    description:
        "Актуальные цены и сроки запуска по всем направлениям digital-маркетинга агентства mit3.",
};

export default async function PricingPage() {
    const categories = await api.service.getCategoriesWithServices();

    return (
        <div className="space-y-10">
            <Breadcrumbs items={[{ label: "Цены" }]} />

            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Прайс-лист агентства
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                    Прозрачная стоимость стартовых форматов по каждому направлению.
                    Точная смета формируется после диагностики вашего проекта.
                </p>
            </div>

            <div className="space-y-8">
                {categories.map((cat) => (
                    <Card key={cat.id}>
                        <CardHeader className="border-b pb-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <CardTitle className="text-xl">{cat.title}</CardTitle>
                                <Link
                                    href={`/services/${cat.slug}`}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Все услуги раздела →
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="divide-y pt-2">
                            {cat.services.map((srv) => (
                                <div
                                    key={srv.id}
                                    className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                                >
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Link
                                                href={`/services/${cat.slug}/${srv.slug}`}
                                                className="font-semibold hover:text-primary hover:underline"
                                            >
                                                {srv.title}
                                            </Link>
                                            {srv.isPopular && (
                                                <Badge variant="secondary">Популярное</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {srv.description}
                                        </p>
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
