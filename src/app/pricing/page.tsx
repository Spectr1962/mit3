import Link from "next/link";
import { Check } from "lucide-react";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

export default async function PricingPage() {
    const services = await api.service.getAll();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Цены на услуги</h1>
                <p className="text-muted-foreground mt-2">
                    Прозрачная стоимость и понятные сроки выполнения без скрытых платежей
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
                                        <Badge variant="outline">{service.category}</Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {service.description} • Срок: {service.duration}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-4 sm:justify-end">
                                    <span className="text-lg font-bold whitespace-nowrap">
                                        от {service.priceFrom.toLocaleString("ru-RU")} ₽
                                    </span>
                                    <Link
                                        href={`/contacts?service=${service.slug}`}
                                        className={buttonVariants({ size: "sm" })}
                                    >
                                        Выбрать
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Блок преимуществ работы */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    "Фиксированная смета до старта работ",
                    "Поэтапная оплата по результату",
                    "Бесплатная консультация и оценка",
                ].map((item) => (
                    <div
                        key={item}
                        className="bg-card flex items-center gap-3 rounded-xl border p-4 text-sm font-medium"
                    >
                        <Check className="text-primary h-5 w-5 shrink-0" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
