import { api } from "~/trpc/server";
import { Users, Activity, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

// Выключаем кэширование админки (данные должны быть всегда свежими — SSR)
export const revalidate = 0;

export default async function AdminDashboardPage() {
    // Запрашиваем живую статистику и последние 15 действий из PostgreSQL через tRPC
    const stats = await api.admin.getDashboardStats();

    return (
        <div className="space-y-6 py-6 max-w-6xl mx-auto px-4">

            {/* Шапка админки */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                        Главная панель управления MIT3
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground">
                        Система мониторинга активности и аналитики PWA-платформы в реальном времени.
                    </p>
                </div>
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border p-2 rounded-xl bg-card">
                    <ArrowLeft className="h-3.5 w-3.5" /> На сайт
                </Link>
            </div>

            {/* Сетка виджетов верхнего уровня */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 bg-card border rounded-2xl flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users className="h-6 w-6" /></div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Клиенты в базе</p>
                        <h3 className="text-2xl font-black font-mono text-foreground">{stats.totalUsers}</h3>
                    </div>
                </div>

                <div className="p-5 bg-card border rounded-2xl flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Activity className="h-6 w-6" /></div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Всего логов в БД</p>
                        <h3 className="text-2xl font-black font-mono text-green-500">{stats.totalLogs}</h3>
                    </div>
                </div>
            </div>

            {/* ЖИВОЙ СТРИМ ДЕЙСТВИЙ ПОЛЬЗОВАТЕЛЕЙ */}
            <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <h2 className="font-bold text-sm flex items-center gap-2 text-foreground">
                        <Activity className="h-4 w-4 text-primary animate-pulse" />
                        Живой поток действий пользователей (Real-time Stream)
                    </h2>
                    <span className="text-[10px] bg-primary/10 text-primary font-mono font-bold px-2 py-0.5 rounded-full">
                        Автообновление при переходах
                    </span>
                </div>

                <div className="divide-y max-h-[500px] overflow-y-auto">
                    {stats.recentActivities.length === 0 ? (
                        <div className="p-8 text-center text-xs text-muted-foreground">
                            Логи активности еще не падали в базу данных Docker.
                        </div>
                    ) : (
                        stats.recentActivities.map((log) => (
                            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs md:text-sm hover:bg-muted/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                                        👤 {log.user?.name ? `${log.user.name} (${log.user.email})` : "📱 Анонимный гость (PWA User)"}
                                    </p>
                                    <p className="text-muted-foreground text-xs md:text-sm">
                                        Действие: <span className="text-foreground/90 font-medium bg-muted/60 px-1.5 py-0.5 rounded border text-xs">{log.action}</span>
                                    </p>
                                </div>

                                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 mt-1 sm:mt-0">
                                    <span className="px-2 py-0.5 rounded bg-primary/5 text-[10px] text-primary font-mono border border-primary/10">
                                        {log.path}
                                    </span>
                                    <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(log.createdAt).toLocaleTimeString("ru-RU")}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
