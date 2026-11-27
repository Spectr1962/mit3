import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { ServicesHub } from "~/components/ServicesHub";

export const metadata: Metadata = {
    title: "Услуги комплексного цифрового маркетинга",
    description:
        "Все направления digital-маркетинга в одном окне: стратегия и CMO, SEO, SERM, Performance-трафик, SMM, продакшн, CRM, аналитика и разработка PWA.",
};

export default async function ServicesHubPage() {
    const categories = await api.service.getCategoriesWithServices();

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Услуги и направления агентства
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                    Выберите нужное направление цифрового маркетинга или воспользуйтесь
                    поиском, чтобы быстро найти конкретную задачу и стоимость запуска.
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
