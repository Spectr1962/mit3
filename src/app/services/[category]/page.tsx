import Link from "next/link";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
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

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { category: slug } = await params;
    const category = await api.service.getCategoryBySlug({ slug });

    if (!category) {
        return { title: "Направление не найдено" };
    }

    return {
        title: `${category.title} — услуги и цены`,
        description: category.shortDesc,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category: slug } = await params;
    const category = await api.service.getCategoryBySlug({ slug });

    if (!category) {
        notFound();
    }

    return (
        <div className="space-y-10">
            {/* Хлебные крошки */}
            <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                    Главная
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/services" className="hover:text-foreground">
                    Услуги
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-foreground">{category.title}</span>
            </nav>

            {/* Заголовок и описание направления */}
            <section className="space-y-4">
                <Badge variant="secondary">Направление • {category.services.length} услуг</Badge>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {category.title}
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {category.fullDesc}
                </p>
            </section>

            {/* Список конечных услуг внутри направления */}
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {category.services.map((service) => (
                    <Card key={service.id} className="flex flex-col justify-between">
                        <CardHeader>
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Срок: {service.duration}
                                </span>
                                {service.isPopular && <Badge>Популярное</Badge>}
                            </div>
                            <CardTitle className="text-xl">
                                <Link
                                    href={`/services/${category.slug}/${service.slug}`}
                                    className="hover:text-primary hover:underline"
                                >
                                    {service.title}
                                </Link>
                            </CardTitle>
                            <CardDescription className="pt-1">
                                {service.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {service.features.length > 0 && (
                                <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    {service.features.slice(0, 3).map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="pt-2 text-2xl font-bold">
                                от {service.priceFrom.toLocaleString("ru-RU")} ₽{" "}
                                {service.priceNote && (
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {service.priceNote}
                                    </span>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex gap-3">
                            <Link
                                href={`/services/${category.slug}/${service.slug}`}
                                className={buttonVariants({
                                    variant: "outline",
                                    className: "flex-1 gap-1.5",
                                })}
                            >
                                Подробнее
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href={`/contacts?service=${service.slug}`}
                                className={buttonVariants({ className: "flex-1" })}
                            >
                                Заказать
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </section>
        </div>
    );
}
