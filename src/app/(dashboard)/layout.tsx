import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    User,
    Layers,
    Briefcase,
    Newspaper,
    LogOut,
    Home
} from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Извлекаем сессию авторизации на сервере
    const session = await getServerAuthSession();

    // 2. СТРОГАЯ ЗАЩИТА: Если пользователь вообще не вошел в систему — отправляем на авторизацию
    if (!session) {
        redirect("/login");
    }

    // Было: const isAdmin = (session?.user as any)?.role === "ADMIN";
    // Замените на:
    const isAdmin = session?.user?.role === "ADMIN";


    return (
        <div className="flex min-h-screen bg-muted/20">

            {/* ЛЕВАЯ ПАНЕЛЬ: САЙДБАР (Отображается только на десктопе md:flex) */}
            <aside className="hidden md:flex flex-col w-64 bg-card border-r p-5 justify-between sticky top-0 h-screen">
                <div className="space-y-6">
                    {/* Логотип кабинета */}
                    <Link href="/" className="font-black text-lg tracking-tight flex items-center gap-2 px-2">
                        🚀 <span>MIT3.Control</span>
                    </Link>

                    {/* Список навигационных ссылок */}
                    <nav className="space-y-1">
                        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors rounded-xl">
                            <Home className="h-4 w-4" /> На главную сайта
                        </Link>

                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-xl transition-all">
                            <User className="h-4 w-4 text-primary" /> Мой профиль
                        </Link>

                        {/* БЛОК МЕНЮ: Показываем только администратору */}
                        {isAdmin && (
                            <div className="pt-4 space-y-1 border-t mt-4">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-3 block mb-2">
                                    Управление (Админ)
                                </span>
                                <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-foreground bg-primary/5 border border-primary/10 rounded-xl text-primary">
                                    <LayoutDashboard className="h-4 w-4" /> Аналитика логов
                                </Link>
                                <Link href="/admin/services" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all">
                                    <Layers className="h-4 w-4" /> 7 Разделов услуг
                                </Link>
                                <Link href="/admin/cases" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all">
                                    <Briefcase className="h-4 w-4" /> Портфолио кейсов
                                </Link>
                                <Link href="/admin/media" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all">
                                    <Newspaper className="h-4 w-4" /> Медиацентр
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>

                {/* Подвал сайдбара с профилем */}
                <div className="border-t pt-4 space-y-3">
                    <div className="px-2">
                        <p className="text-xs font-bold text-foreground truncate">{session.user?.name ?? "Пользователь"}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/5 rounded-xl transition-colors">
                        <LogOut className="h-4 w-4" /> Выйти из аккаунта
                    </button>
                </div>
            </aside>

            {/* ПРАВАЯ ЧАСТЬ: ОСНОВНОЙ КОНТЕНТ (Сюда прокидываются страницы /admin или /profile) */}
            <main className="flex-1 overflow-x-hidden min-h-screen">
                {/* Мобильная компактная шапка для ЛК (скрыта на ПК) */}
                <div className="flex md:hidden items-center justify-between p-4 border-b bg-card">
                    <Link href="/" className="font-bold text-sm">🚀 MIT3.Control</Link>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full font-mono">
                        {isAdmin ? "ADMIN" : "USER"}
                    </span>
                </div>

                {/* Рендеринг дочерних страниц */}
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>

        </div>
    );
}
