import Link from "next/link";
import { ArrowRight, TrendingUp, Layers, Smartphone, CheckCircle2 } from "lucide-react";
import { api } from "~/trpc/server";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function HomePage() {
  const services = await api.service.getAll();
  const featuredServices = services.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Первый экран (Hero) */}
      <section className="space-y-6 pt-4">
        <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
          Агентство цифрового маркетинга • Стратегия, трафик и PWA
        </Badge>

        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
          Комплексный цифровой маркетинг, который приводит целевых клиентов
        </h1>

        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Выстраиваем единую систему привлечения и удержания: от глубокого
          анализа рынка и упаковки смыслов до SEO, контент-маркетинга и
          сверхбыстрых PWA-сайтов с высокой конверсией.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/contacts"
            className={buttonVariants({ size: "lg", className: "gap-2" })}
          >
            Обсудить задачи бизнеса
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Направления и форматы работы
          </Link>
        </div>
      </section>

      {/* Ключевые опоры агентства */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <Layers className="mb-2 h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Системный подход</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Связываем стратегию, SEO, социальные сети и контент в единую
            воронку без разрыва между подрядчиками.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Smartphone className="mb-2 h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Технологичная упаковка</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Создаём быстрые PWA-платформы, которые устанавливаются на смартфон
            клиента и повышают конверсию трафика.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <TrendingUp className="mb-2 h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Фокус на окупаемость</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Опираемся на аналитику и реальную стоимость заявки, прозрачно
            отчитываясь за каждый этап продвижения.
          </CardContent>
        </Card>
      </section>

      {/* Популярные форматы из базы данных */}
      {featuredServices.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Форматы работы
              </h2>
              <p className="text-sm text-muted-foreground">
                Комплексные решения под цели и масштаб вашего проекта
              </p>
            </div>
            <Link
              href="/pricing"
              className="hidden text-sm font-medium text-primary hover:underline sm:inline-block"
            >
              Весь прайс-лист →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <Card key={service.id} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge variant="outline">{service.category}</Badge>
                    {service.isPopular && <Badge>Популярное</Badge>}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">
                    от {service.priceFrom.toLocaleString("ru-RU")} ₽
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Срок запуска: {service.duration}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link
                    href={`/contacts?service=${service.slug}`}
                    className={buttonVariants({
                      variant: service.isPopular ? "default" : "secondary",
                      className: "w-full",
                    })}
                  >
                    Обсудить формат
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
