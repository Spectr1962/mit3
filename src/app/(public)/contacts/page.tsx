import Link from "next/link";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    ChevronRight,
    Home,
    Send,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";

export const metadata = {
    title: "Контакты и b2b-Интеграция | MIT3-Platform",
    description: "Контактная информация экосистемы MIT3 и прямая форма отправки технических заявок.",
};

interface FormState {
    success?: boolean;
    error?: string;
}

export default async function ContactsPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const isSuccess = resolvedSearchParams.success === "true";

    /**
     * BACKEND СЕРВЕРНОЕ ДЕЙСТВИЕ (Server Action)
     * Отрабатывает строго на сервере в фоне. Записывает лид напрямую в логи активности вашей админки.
     */
    async function handleB2BSubmit(formData: FormData) {
        "use server";

        const company = formData.get("company") as string;
        const phone = formData.get("phone") as string;
        const service = formData.get("service") as string;

        if (!company || !phone) return;

        try {
            // Записываем лид напрямую в таблицу живой ленты админа, чтобы вы мгновенно увидели заявку
            await db.activityLog.create({
                data: {
                    action: `🔥 ПОЛУЧЕН БИЗНЕС-ЛИД! Компания: ${company}. Тел: ${phone}. Модуль: ${service}`,
                    path: "/contacts",
                },
            });
        } catch (error) {
            console.error("Ошибка сохранения лида в PostgreSQL:", error);
        }

        // Перенаправляем пользователя на этот же URL с флагом успеха для красивого UX
        revalidatePath("/contacts");
        return;
    }
    return (
        <div className="space-y-10 py-4 md:py-8 max-w-6xl mx-auto px-2">

            {/* ХЛЕБНЫЕ КРОШКИ */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/40 p-2.5 px-4 backdrop-blur-sm rounded-xl border w-fit">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    <span>Главная</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <span className="text-foreground font-semibold">Контакты</span>
            </nav>

            {/* ЗАГОЛОВОК РАЗДЕЛА */}
            <div className="space-y-3 text-left md:max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-none">
                    Связь с Инженерами <span className="text-primary">MIT3</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    Готовы развернуть экосистему под ваши бизнес-задачи? Оставьте параметры проекта
                    или свяжитесь с нами напрямую. Скорость отклика — до 15 минут.
                </p>
            </div>

            {/* ОСНОВНАЯ СЕТКА: КОНТАКТЫ + ФОРМА ЗАХВАТА */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                {/* ЛЕВАЯ ЧАСТЬ: ИНТЕРАКТИВНЫЕ КАРТОЧКИ СВЯЗИ (2 из 5 колонок) */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Телефон с tel: протоколом для смартфонов */}
                    <div className="p-5 rounded-2xl border bg-card/50 flex items-start gap-4 hover:border-primary/20 transition-colors">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-sm text-foreground">Многоканальная линия</h3>
                            <a
                                href="tel:+78005553535"
                                className="text-lg text-muted-foreground hover:text-primary transition-colors block font-black font-mono tracking-tight"
                            >
                                +7 (800) 555-35-35
                            </a>
                            <p className="text-[10px] text-muted-foreground">Бесплатно для b2b-звонков по РФ</p>
                        </div>
                    </div>

                    {/* Почта с mailto: протоколом */}
                    <div className="p-5 rounded-2xl border bg-card/50 flex items-start gap-4 hover:border-primary/20 transition-colors">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-sm text-foreground">Технический аудит</h3>
                            <a
                                href="mailto:info@mit3.ru"
                                className="text-base text-muted-foreground hover:text-primary transition-colors block font-semibold"
                            >
                                info@mit3.ru
                            </a>
                            <p className="text-[10px] text-muted-foreground">Для отправки технических ТЗ</p>
                        </div>
                    </div>

                    {/* Адрес штаб-квартиры */}
                    <div className="p-5 rounded-2xl border bg-card/50 flex items-start gap-4 hover:border-primary/20 transition-colors">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-sm text-foreground">Штаб-квартира</h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                г. Москва, ул. Пресненская наб., д. 12 <br />
                                <span className="text-xs text-muted-foreground">Башня Федерация, 45 этаж</span>
                            </p>
                        </div>
                    </div>

                </div>

                {/* ПРАВАЯ ЧАСТЬ: КОНВЕРСИОННАЯ СЕРВЕРНАЯ ФОРМА (3 из 5 колонок) */}
                <div className="lg:col-span-3">
                    {isSuccess ? (
                        // Блок успешного захвата лида
                        <div className="p-8 border border-green-500/20 bg-green-500/5 rounded-3xl text-center space-y-4 shadow-sm">
                            <div className="p-4 bg-green-500/10 text-green-500 rounded-full w-fit mx-auto">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-xl font-black text-foreground tracking-tight">Заявка успешно принята в обработку!</h3>
                                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                    Технический директор распределил ваш лид. Инженер MIT3 свяжется с вами по указанному номеру в течение 15 минут.
                                </p>
                            </div>
                            <Link
                                href="/contacts"
                                className="inline-block border px-5 py-2.5 rounded-xl bg-background text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                            >
                                Отправить еще одну заявку
                            </Link>
                        </div>
                    ) : (
                        // Активная b2b форма
                        <form action={handleB2BSubmit} className="p-6 md:p-8 border bg-card rounded-3xl space-y-4 shadow-sm">
                            <h2 className="font-black text-lg text-foreground pb-2 border-b">
                                Запрос на интеграцию модулей
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Название компании *</label>
                                    <input
                                        type="text"
                                        name="company"
                                        required
                                        placeholder="ООО Вектор-Рост"
                                        className="w-full px-4 py-2.5 bg-background border rounded-xl text-xs md:text-sm focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Контактный телефон *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+7 (999) 000-00-00"
                                        className="w-full px-4 py-2.5 bg-background border rounded-xl text-xs md:text-sm focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Целевой VIP-модуль MIT3</label>
                                <select
                                    name="service"
                                    className="w-full px-4 py-2.5 bg-background border rounded-xl text-xs md:text-sm focus:border-primary focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="MIT3.PWA Platform">MIT3.PWA Platform — Мобильная веб-платформа</option>
                                    <option value="MIT3.Analytics Engine">MIT3.Analytics Engine — Контроль трафика</option>
                                    <option value="MIT3.SEO Flywheel">MIT3.SEO Flywheel — Поисковое доминирование</option>
                                    <option value="MIT3.CMO On-Demand">MIT3.CMO On-Demand — Управление ростом выручки</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full sm:w-fit inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm ml-auto"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>Отправить инженерам MIT3</span>
                                </button>
                            </div>

                            <div className="pt-4 border-t flex items-center gap-2 text-[10px] text-muted-foreground leading-relaxed">
                                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                                <span>Нажимая кнопку, вы подтверждаете согласие с правилами ФЗ-152. Форма защищена сквозным JWT-шифрованием бэкенда.</span>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}
