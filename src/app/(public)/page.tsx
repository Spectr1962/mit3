import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { ArrowRight, Layers, Newspaper, Briefcase } from "lucide-react";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 text-center space-y-8 max-w-3xl mx-auto px-4">

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Многостраничная <span className="text-primary">PWA Платформа</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-xl max-w-xl mx-auto">
            Услуги, медиацентр, портфолио кейсов и личный кабинет на современном T3-стеке.
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-card w-full max-w-md text-sm">
          {session ? (
            <p className="text-muted-foreground">
              Вы вошли как: <span className="font-semibold text-foreground">{session.user?.name || session.user?.email}</span>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Вы просматриваете сайт как гость. Войдите для доступа к личному кабинету.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4">
          <Link href="/services" className="p-5 border rounded-xl bg-card hover:border-primary transition-all flex flex-col items-center gap-2 group">
            <Layers className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">7 Разделов услуг</span>
          </Link>
          <Link href="/cases" className="p-5 border rounded-xl bg-card hover:border-primary transition-all flex flex-col items-center gap-2 group">
            <Briefcase className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Портфолио кейсов</span>
          </Link>
          <Link href="/media" className="p-5 border rounded-xl bg-card hover:border-primary transition-all flex flex-col items-center gap-2 group">
            <Newspaper className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Медиацентр</span>
          </Link>
        </div>

        <div className="pt-4">
          <Link
            href={session ? "/profile" : "/login"}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span>{session ? "Перейти в кабинет" : "Войти в аккаунт"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </HydrateClient>
  );
}
