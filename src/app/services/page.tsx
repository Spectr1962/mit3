import Link from "next/link";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

export default async function ServicesPage() {
    const services = await api.service.getAll();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Наши услуги</h1>
                <p className="text-muted-foreground mt-2">
                    Выберите подходящее решение для вашей задачи
                </p>
            </div>

            {services.length === 0 ? (
                <p className="text-muted-foreground">
                    Услуги пока не добавлены. Добавьте первую запись через Prisma Studio.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card key={service.id} className="flex flex-col justify-between">
                            <CardHeader>
                                <div className="flex items-center justify-between gap-2">
                                    <Badge variant="secondary">{service.category.title}</Badge>
                                    {service.isPopular && <Badge>Популярное</Badge>}
                                </div>
                                <CardTitle className="pt-2 text-xl">{service.title}</CardTitle>
                                <CardDescription>{service.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    от {service.priceFrom.toLocaleString("ru-RU")} ₽
                                </div>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    Срок выполнения: {service.duration}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Link
                                    href={`/contacts?service=${service.slug}`}
                                    className={buttonVariants({ className: "w-full" })}
                                >
                                    Заказать услугу
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
