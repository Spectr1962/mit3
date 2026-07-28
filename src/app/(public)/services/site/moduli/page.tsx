import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Намертво фиксируем Core Web Vitals лимиты: кэшируем страницу, но позволяем обновлять данные
export const revalidate = 60;

export default async function ModuliCatalogPage() {
    // 1. Прямой высокоскоростной запрос к PostgreSQL через Singleton Prisma Client
    // Забираем строго коммерческие модули допродажи (MODULE) по требованиям Блока 4 из ТЗ
    const commercialModules = await prisma.service.findMany({
        where: {
            type: "MODULE",
        },
        include: {
            niche: true, // Подтягиваем связанные ниши для SEO-перелинковки
        },
        orderBy: {
            setupPrice: "asc",
        },
    });

    return (
        <div className="w-full max-w-full overflow-x-hidden bg-black text-white min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Заголовок витрины модулей согласно Блоку 4 из ТЗ */}
                <div className="text-left space-y-4 mb-12 max-w-3xl">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-widest block">
            // mit3.architecture // шведский стол модулей
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white text-balance">
                        Витрина коммерческих ИТ-модулей и маркетинг-компонентов для интеграции в Москве
                    </h1>
                    <p className="text-sm text-neutral-400 leading-relaxed text-balance">
                        Расширяйте базовые возможности вашей PWA-платформы. Подключайте готовые b2b-модули захвата лидов, CRM-интеграций и автоматизации маркетинга в один клик. Разделение страницы на подстраницы запрещено по ТЗ.
                    </p>
                </div>

                {/* СЕТКА МОДУЛЕЙ: Автоматически подстраивается под размеры экранов (от iPhone до 4K мониторов) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {commercialModules.length > 0 ? (
                        commercialModules.map((item) => (
                            <div
                                key={item.id}
                                className="bg-zinc-950 border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 hover:shadow-[0_0_40px_rgba(99,102,241,0.03)] transition-all duration-300 min-h-[280px]"
                            >
                                <div className="space-y-4 text-left">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                                            {item.name}
                                        </h3>
                                        <span className="text-[9px] font-mono text-neutral-400 font-bold bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md shrink-0 uppercase">
                                            {item.tier}
                                        </span>
                                    </div>

                                    <p className="text-xs text-neutral-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                {/* 2. НИЖНИЙ КЛАСТЕР: ЦЕНЫ, КНОПКА И SEO-ПЕРЕЛИНКОВКА ПО ТЗ */}
                                <div className="mt-6 space-y-4">
                                    {/* Вывод разовой стоимости внедрения */}
                                    <div className="pt-3 border-t border-white/5 flex items-baseline justify-between">
                                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">// Стоимость запуска:</span>
                                        <span className="text-base font-black font-mono text-white">
                                            {item.setupPrice.toLocaleString("ru-RU")} ₽
                                        </span>
                                    </div>

                                    {/* Кнопка действия с защитой тача на iPhone */}
                                    <a
                                        href={`#audit-form?module_name=${encodeURIComponent(item.name)}`}
                                        className="block w-full py-2.5 bg-neutral-900 hover:bg-white border border-neutral-800 hover:border-white text-neutral-300 hover:text-black font-bold rounded-xl text-center text-xs tracking-tight transition-all duration-150 touch-manipulation select-none"
                                    >
                                        Обсудить внедрение
                                    </a>

                                    {/* БЛОК SEO-ПЕРЕЛИНКОВКИ: Вывод кликабельных тегов-ссылок на ниши по ТЗ */}
                                    <div className="pt-2 flex flex-wrap items-center gap-1.5 min-h-[20px]">
                                        <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-wider">Применимо:</span>
                                        {item.niche ? (
                                            <Link
                                                href={`/services/site/medicina/${item.niche.slug}`}
                                                className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 hover:underline bg-indigo-950/20 border border-indigo-900/30 px-2 py-0.5 rounded-md transition-colors"
                                            >
                                                {item.niche.seoTitle.split("—")[0] || "Медицина"}
                                            </Link>
                                        ) : (
                                            /* Если модуль сквозной, выводим общие медицинские теги для перелинковки веса */
                                            <Link
                                                href="/services/site/medicina/stomatologiya"
                                                className="text-[10px] font-mono font-bold text-neutral-500 hover:text-white bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md transition-colors"
                                            >
                                                Стоматология
                                            </Link>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        /* Экран-заглушка, если база PostgreSQL пустая (запустим сидирование на следующем шаге) */
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 border border-dashed border-neutral-800 rounded-2xl py-16 text-center text-zinc-600 font-mono text-xs">
              // База данных пуста. Запустите b2b-скрипт наполнения таблиц в терминале.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
