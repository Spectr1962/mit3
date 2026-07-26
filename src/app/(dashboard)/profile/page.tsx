import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import {
    User,
    Mail,
    Shield,
    Layers,
    Clock,
    CheckCircle2,
    HelpCircle,
    KeyRound
} from "lucide-react";
import Link from "next/link";

// Выключаем кэширование профиля, данные должны запрашиваться из базы в реальном времени (SSR)
export const revalidate = 0;

export default async function ProfilePage() {
    // 1. Получаем сессию авторизованного пользователя на сервере
    const session = await getServerAuthSession();

    // Защита: если сессии нет, принудительно редиректим на вход
    if (!session?.user) {
        redirect("/login");
    }

    // 2. Имитируем получение списка заказанных услуг пользователя (для демонстрации b2b логики)
    // В реальной БД здесь будет связь User -> Orders -> Services
    const mockedActiveServices = [
        { title: "MIT3.Analytics", plan: "Enterprise", status: "Активен", date: "до 12.12.2026" },
        { title: "MIT3.PWA", plan: "Custom Integration", status: "В разработке", date: "сдача 15.08.2026" },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-2">

            {/* ПРИВЕТСТВИЕ И СТАТУС */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                        Личный кабинет клиента
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground">
                        Управление интеграциями, b2b-метриками и безопасность вашего профиля.
                    </p>
                </div>

                {/* Кнопка быстрого перехода в админку, если зашел суперадмин */}
                {session?.user?.role === "ADMIN" && (
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/20 transition-colors shadow-sm"
                    >
                        <Shield className="h-3.5 w-3.5" />
                        <span>Панель администратора</span>
                    </Link>
                )}
            </div>

            {/* ОСНОВНАЯ СЕТКА КАБИНЕТА */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ЛЕВАЯ КОЛОНКА: КАРТОЧКА ПРОФИЛЯ */}
                <div className="space-y-4 lg:col-span-1">
                    <div className="p-6 bg-card border rounded-2xl space-y-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                                <User className="h-6 w-6" />
                            </div>
                            <div className="space-y-0.5 truncate">
                                <h3 className="font-bold text-base text-foreground truncate">
                                    {session.user.name ?? "Клиент платформы"}
                                </h3>
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono uppercase">
                                    {session?.user?.role ?? "USER"} Account
                                </span>
                            </div>
                        </div>

                        {/* Системные данные */}
                        <div className="space-y-3.5 text-xs border-t pt-4">
                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary/60 shrink-0" />
                                <span className="truncate text-foreground/90">{session.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                <KeyRound className="h-4 w-4 text-primary/60 shrink-0" />
                                <span>ID сессии: <strong className="font-mono text-[10px] text-foreground">{session.user.id.slice(0, 12)}...</strong></span>
                            </div>
                        </div>

                        <button className="w-full text-center py-2.5 rounded-xl border text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                            Редактировать профиль
                        </button>
                    </div>

                    {/* Виджет техподдержки */}
                    <div className="p-5 bg-muted/20 border border-dashed rounded-2xl space-y-3 text-xs text-muted-foreground">
                        <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                            <HelpCircle className="h-4 w-4 text-primary" /> Персональный менеджер
                        </h4>
                        <p className="leading-relaxed">
                            Нужна кастомизация модулей или возникли вопросы по сквозной аналитике? Напишите в VIP-поддержку.
                        </p>
                        <a href="mailto:support@mit3.ru" className="text-primary font-bold hover:underline block pt-1">
                            support@mit3.ru &rarr;
                        </a>
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА: ИНТЕГРАЦИИ И БЕЗОПАСНОСТЬ */}
                <div className="space-y-6 lg:col-span-2">

                    {/* БЛОК 1: ПОДКЛЮЧЕННЫЕ МОДУЛИ ИЗ 7 УСЛУГ */}
                    <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                        <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" />
                            <h2 className="font-bold text-sm text-foreground">Ваша матрица интеграций MIT3</h2>
                        </div>

                        <div className="divide-y">
                            {mockedActiveServices.map((service, index) => (
                                <div key={index} className="p-4 flex items-center justify-between gap-4 text-xs md:text-sm hover:bg-muted/5 transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-bold text-foreground">{service.title}</p>
                                        <p className="text-xs text-muted-foreground font-medium">Тариф: {service.plan}</p>
                                    </div>

                                    <div className="text-right space-y-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${service.status === "Активен" ? "bg-green-500/10 text-green-500" : "bg-purple-500/10 text-purple-500"
                                            }`}>
                                            <CheckCircle2 className="h-3 w-3" /> {service.status}
                                        </span>
                                        <p className="text-[10px] text-muted-foreground font-mono">{service.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-muted/20 border-t text-center">
                            <Link href="/services" className="text-xs text-primary font-bold hover:underline">
                                Подключить дополнительные VIP-модули роста &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* БЛОК 2: ЖУРНАЛ КЛИЕНТСКОЙ БЕЗОПАСНОСТИ */}
                    <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                        <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <h2 className="font-bold text-sm text-foreground">История входов и логов безопасности</h2>
                        </div>

                        <div className="p-4 space-y-3 text-xs text-muted-foreground leading-relaxed">
                            <p>
                                Ваши b2b-действия на платформе непрерывно защищаются сквозным шифрованием.
                                В целях кибербезопасности, системные администраторы видят поток кликов вашего аккаунта
                                в реальном времени на главной панели управления.
                            </p>
                            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-primary font-medium flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                <span>Интеграция фонового трекинга активности PWA активна для вашего ID</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
