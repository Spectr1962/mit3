// УБРАЛИ ПЯТИУРОВНЕВЫЕ ТОЧКИ, СДЕЛАВ ИМПОРТ НЕЗАВИСИМЫМ:
import { prisma } from "~/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
    params: Promise<{
        industrySlug: string;
        nicheSlug: string;
    }>;
}

// Динамически генерируем 100% SEO-оптимизированные метатеги из базы данных под требования Яндекса и Google
export async function generateMetadata({ params }: Props) {
    const { nicheSlug } = await params;
    const pageData = await prisma.nichePage.findUnique({
        where: { slug: nicheSlug }
    });

    if (!pageData) return {};

    return {
        title: pageData.seoTitle,
        description: pageData.seoDesc,
    };
}

export default async function DynamicNicheLandingPage({ params }: Props) {
    const { industrySlug, nicheSlug } = await params;

    // Прямой высокоскоростной b2b-запрос к PostgreSQL с подтягиванием всех привязанных тарифов
    const nicheData = await prisma.nichePage.findUnique({
        where: { slug: nicheSlug },
        include: {
            services: {
                orderBy: { setupPrice: "asc" }
            }
        }
    });

    // Если собственник бизнеса ввел несуществующий slug, Next.js принудительно выдаст чистую 404 страницу
    if (!nicheData) {
        notFound();
    }

    return (
        <div className="w-full max-w-full overflow-x-hidden bg-black text-white min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">

                {/* ПЕРВЫЙ ЭКРАН (Блок 3.1 из ТЗ) */}
                <header className="text-left space-y-4">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-widest bg-indigo-950/40 border border-indigo-900/40 px-2.5 py-1 rounded-md inline-block">
            // ИТ-конвейер mit3 // сектор: {industrySlug}
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white text-balance">
                        {nicheData.heroTitle}
                    </h1>
                </header>

                {/* БЛОК БОЛЕЙ «ТОЧКА А» (Блок 3.2 из ТЗ) */}
                <section className="bg-zinc-950 border border-neutral-900 rounded-2xl p-6 md:p-8 text-left border-l-4 border-l-red-500/70">
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white mb-3">
                        {nicheData.painTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed text-balance">
                        {nicheData.painDesc}
                    </p>
                </section>
                {/* ========================================================= */}
                {/* БЛОК 3.3 ИЗ ТЗ: «ШВЕДСКИЙ СТОЛ» ТАРИФОВ И ПРАЙСОВ ИЗ POSTGRESQL */}
                {/* ========================================================= */}
                <section className="space-y-6">
                    <div className="text-left space-y-1">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">// Выберите ИТ-контур внедрения:</span>
                        <h2 className="text-xl font-black tracking-tight text-white">Пакетные решения и b2b-модели</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {nicheData.services.map((service) => {
                            const isBase = service.tier === "BASE";
                            const isMax = service.tier === "MAX";

                            return (
                                <div
                                    key={service.id}
                                    className={`bg-zinc-950 border rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.01] transition-all duration-200 min-h-[360px] text-left ${service.tier === "BUSINESS"
                                        ? "border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.05)] relative before:content-['//_POPULAR'] before:absolute before:-top-2.5 before:left-4 before:bg-indigo-600 before:text-white before:font-mono before:text-[8px] before:font-bold before:px-1.5 before:py-0.5 before:rounded"
                                        : "border-neutral-900"
                                        }`}
                                >
                                    {/* Верхняя часть карточки тарифа */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-sm font-black text-white uppercase tracking-tight">
                                                {service.name.split(" — ")[1] || service.name}
                                            </h3>
                                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${isBase ? "bg-neutral-900 text-neutral-400" : isMax ? "bg-emerald-950 text-emerald-400" : "bg-indigo-950 text-indigo-400"
                                                }`}>
                                                {service.tier}
                                            </span>
                                        </div>

                                        <p className="text-xs text-neutral-400 leading-relaxed min-h-[48px]">
                                            {service.description}
                                        </p>

                                        {/* Вывод лимитов позиций прайса strictly по ТЗ (не более 30 для BASE) */}
                                        <div className="text-[11px] font-mono text-neutral-500 bg-black/40 border border-neutral-900/60 p-2.5 rounded-lg space-y-1">
                                            <p>• Наполнение контентом под ключ</p>
                                            <p>
                                                • Прайс-лист:{" "}
                                                <span className={isBase ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                                                    {isBase ? `до ${service.itemLimit} позиций` : "без ограничений"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Слой стоимости и кнопка заказа с защитой тача на iPhone */}
                                    <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
                                        <div className="flex flex-col gap-0.5 font-mono">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-neutral-500">Запуск:</span>
                                                <span className="text-white font-bold">{service.setupPrice.toLocaleString("ru-RU")} ₽</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-neutral-500">Поддержка:</span>
                                                <span className="text-indigo-400 font-bold">{service.monthlyPrice.toLocaleString("ru-RU")} ₽/мес</span>
                                            </div>
                                        </div>

                                        <a
                                            href={`/#audit-form?niche=${nicheSlug}&tier=${service.tier}`}
                                            className={`block w-full py-2.5 text-center font-bold text-xs rounded-xl transition-all touch-manipulation select-none cursor-pointer ${service.tier === "BUSINESS"
                                                ? "bg-white text-black hover:bg-neutral-100 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                                                : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                                                }`}
                                        >
                                            Заказать внедрение
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ========================================================= */}
                {/* БЛОК 4 ИЗ ТЗ: СКВОЗНАЯ ПЕРЕЛИНКОВКА НА ОБЩУЮ ВИТРИНУ МОДУЛЕЙ */}
                {/* ========================================================= */}
                <footer className="pt-8 border-t border-zinc-900 text-left">
                    <div className="bg-zinc-950 border border-neutral-900 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h4 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">// Сквозная b2b-допродажа модулей</h4>
                            <p className="text-sm font-bold text-white tracking-tight">Нужен кастомный функционал или CRM-интеграция?</p>
                            <p className="text-xs text-neutral-400 max-w-xl">
                                Соберите индивидуальное решение из нашего ИТ-каталога. Подключайте модули чатов, лояльности и сквозной аналитики.
                            </p>
                        </div>
                        <Link
                            href="/services/site/moduli"
                            className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-500 text-neutral-300 hover:text-white font-mono text-xs font-bold rounded-xl shrink-0 transition-colors touch-manipulation"
                        >
                            Открыть витрину модулей →
                        </Link>
                    </div>
                </footer>

            </div>
        </div>
    );
}
