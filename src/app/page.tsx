import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl">
            Решаем ваши задачи быстро и прозрачно
          </CardTitle>
          <CardDescription className="max-w-2xl pt-2 text-base">
            Ознакомьтесь с нашей витриной услуг, актуальным прайс-листом и
            полезными материалами в блоге.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/services" className={buttonVariants({ size: "lg" })}>
            Смотреть услуги
          </Link>
          <Link
            href="/pricing"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Узнать цены
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}