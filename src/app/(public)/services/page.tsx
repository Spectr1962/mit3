import { prisma } from "../../../lib/prisma";
import Link from "next/link";

// Включаем ISR кэширование на 1 минуту для идеального Core Web Vitals
export const revalidate = 60;

export default async function ServicesPage() {
    // Запрос к PostgreSQL: берем хаб медицины и все привязанные к нему ниши
    const industryHub = await prisma.industryHub.findUnique({
        where: { slug: "medicina" },
        include: {
            niches: {
                where: { isActive: true },
                orderBy: { slug: "asc" }
            }
        }
    });

    return (
        <div className="w-full max-w-full overflow-x-hidden bg-white text-zinc-900 min-h-screen pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Шапка каталога услуг — Контрастные темные тексты */}
                <div className="text-left space-y-4 mb-12 max-w-3xl">
                    <span className="text-[10px] font-mono uppercase text-indigo-600 font-black tracking-widest block">
            // mit3.infrastructure // каталог b2b-решений
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-zinc-900">
                        Отраслевые ИТ-платформы и PWA-решения «Легкий Старт»
                    </h1>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Разверните скоростную мобильную экосистему под вашу нишу бизнеса в Москве за 3 дня. Автоматический захват лидов, бесплатные пуш-коммуникации вместо SMS и 100% независимость от санкций сторов.
                    </p>
                </div>

                {/* СЕТКА МЕДИЦИНСКИХ НИШ — Светлые премиальные карточки */}
                {industryHub && industryHub.niches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {industryHub.niches.map((niche) => (
                            <div
                                key={niche.id}
                                className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)] transition-all duration-300 min-h-[220px]"
                            >
                                <div className="space-y-3 text-left">
                                    <span className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                    // {industryHub.title}
                                    </span>
                                    <h3 className="text-base font-bold text-zinc-900 tracking-tight pt-1">
                                        {niche.seoTitle.split(" — ")[0] || niche.slug}
                                    </h3>
                                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                                        {niche.heroTitle}. Изучите боли точки А, b2b-тарифы внедрения и прайс-листы.
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center justify-between font-mono text-[11px]">
                                    <span className="text-zinc-400">slug: /{niche.slug}</span>
                                    <Link
                                        href={`/services/site/${industryHub.slug}/${niche.slug}`}
                                        className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline touch-manipulation"
                                    >
                                        Открыть лендинг →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Отказоустойчивый экран, если хаб ещё не долетел из Docker */
                    <div className="border border-dashed border-zinc-300 rounded-2xl py-16 text-center text-zinc-400 font-mono text-xs w-full">
            // Отраслевой b2b-контур пуст. Убедитесь, что миграция PostgreSQL в Docker завершена успешно.
                    </div>
                )}

                {/* Нижний баннер перехода на витрину коммерческих модулей по Блоку 4 */}
                <div className="mt-12 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                    <div className="space-y-1">
                        <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">// допродажи модулей шведского стола</h4>
                        <p className="text-sm font-bold text-zinc-900">Ищете готовые ИТ-компоненты для интеграции?</p>
                        <p className="text-xs text-zinc-600">Перейдите в изолированную витрину коммерческих модулей для апгрейда вашей PWA-платформы.</p>
                    </div>
                    <Link
                        href="/services/site/moduli"
                        className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white font-mono text-xs font-bold rounded-xl shrink-0 transition-colors touch-manipulation"
                    >
                        Открыть витрину модулей →
                    </Link>
                </div>

            </div>
        </div>
    );
}
