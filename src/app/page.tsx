"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import type { ServiceSector, Service } from "@prisma/client";

// БЕЗОПАСНОСТЬ: Создаем составной тип Направления вместе со вложенными услугами
// Вместо старого 'Category' теперь строго используется 'ServiceSector'
type SectorWithServices = ServiceSector & {
  services: Service[];
};
export default function HomePage() {
  // Локальное состояние для безопасного рендеринга матрицы услуг на клиенте
  const [sectors, setSectors] = useState<SectorWithServices[]>([]);

  // Запрашиваем из tRPC-роутера направления (getCategories) со всеми услугами
  const { data: dbSectors, isLoading } = api.post.getCategories?.useQuery() ?? {
    data: null,
    isLoading: false,
  };

  // Эффект синхронизации: безопасно прокидываем бэкенд-данные в стейт страницы
  useEffect(() => {
    if (dbSectors) {
      setSectors(dbSectors as SectorWithServices[]);
    }
  }, [dbSectors]);
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-sky-500/30">
      {/* Главный продающий экран студии */}
      <header className="container mx-auto px-6 py-24 text-center max-w-4xl">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20">
          Технологический сдвиг 2026
        </span>
        <h1 className="text-5xl md:text-7xl font-black mt-6 mb-8 tracking-tight leading-none">
          Проектируем <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">PWA-хабы</span> <br />
          для лидеров рынка
        </h1>
        <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Оставляем медленные сайты на Tilda и WordPress в уходящем веке. Создаем отказоустойчивые веб-платформы на Next.js (T3 Stack).
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="#catalog" className="bg-sky-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl hover:bg-sky-400 transition shadow-lg shadow-sky-500/10">
            Смотреть каталог решений
          </a>
          <Link href="/mediacentr" className="border border-slate-700 bg-slate-800/40 text-slate-200 font-medium px-8 py-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition">
            Перейти в Медиацентр
          </Link>
        </div>
      </header>
      {/* Секция витрины: Коммерческий каталог решений из вашей базы данных */}
      <section id="catalog" className="container mx-auto px-6 py-16 max-w-6xl border-t border-slate-800">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Отраслевая экспертиза</h2>
        <p className="text-slate-400 text-sm mb-12">Выберите сферу вашего бизнеса для интеграции готовой PWA-экосистемы.</p>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl bg-slate-800/50 border border-slate-700/50" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sectors?.map((sector) => (
              <div key={sector.id} className="group relative rounded-2xl border border-slate-800 bg-slate-950 p-6 hover:border-slate-700 transition">
                <div className="text-3xl mb-4 text-sky-400">⚡</div>

                {/* ИСПРАВЛЕНО: Выводим новое поле .name вместо убранного .title */}
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-sky-400 transition">
                  {sector.name}
                </h3>

                <p className="text-sm text-slate-400 mb-6 line-clamp-3">
                  {sector.shortDesc}
                </p>
                <Link href="/services" className="text-xs font-semibold uppercase tracking-wider text-sky-400 hover:text-sky-300 flex items-center gap-1">
                  Изучить решение <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
