"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

export default function Home() {
  const health = api.system.health.useQuery();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#123b55,transparent_42%),#07111f] px-6 py-10 text-slate-100">
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-between gap-16">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <span className="text-sm font-bold tracking-[0.25em] text-sky-300">MIT3 / CORE</span>
          <span className="rounded-full border border-emerald-300/30 px-3 py-1 text-xs text-emerald-200">
            {health.isPending ? "API checking" : health.isSuccess ? "API online" : "API offline"}
          </span>
        </header>
        <section className="max-w-3xl space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">PWA foundation</p>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">Чистый старт для цифрового продукта.</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">Next.js, TypeScript, Tailwind, tRPC, Prisma и PostgreSQL уже соединены в одной минимальной архитектуре.</p>
          {health.isPending && <Skeleton className="h-4 max-w-sm" />}
          <div className="flex flex-wrap gap-3">
            <Link href="/api/health" className="rounded-full bg-sky-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-sky-300">Проверить API</Link>
            <a href="/manifest.webmanifest" className="rounded-full border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10">Открыть manifest</a>
          </div>
        </section>
        <footer className="grid gap-3 border-t border-white/10 pt-5 text-sm text-slate-400 sm:grid-cols-3">
          <span>Next.js App Router</span><span>tRPC + React Query</span><span>Prisma + PostgreSQL</span>
        </footer>
      </main>
    </div>
  );
}
