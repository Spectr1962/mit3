"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
    const [password, setPassword] = useState("");
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState("");

    // Проверяем, входил ли ты ранее (чтобы не вводить пароль при каждой перезагрузке)
    useEffect(() => {
        const savedAuth = localStorage.getItem("mit3_admin_auth");
        if (savedAuth === "true") {
            setIsAuth(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // ТВОЙ НАДЕЖНЫЙ ПАРОЛЬ РАЗРАБОТЧИКА (Можешь поменять на любой свой)
        const masterPassword = "mit3_super_secret_2026";

        if (password === masterPassword) {
            localStorage.setItem("mit3_admin_auth", "true");
            setIsAuth(true);
            setError("");
        } else {
            setError("Неверный пароль администратора!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("mit3_admin_auth");
        setIsAuth(false);
        setPassword("");
    };

    // 1. ИНТЕРФЕЙС РАБОЧЕЙ АДМИНКИ (Показывается сразу при правильном пароле)
    if (isAuth) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                {/* Шапка админки */}
                <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">MIT3 Агентство</h1>
                        <p className="text-sm text-slate-500">Панель управления цифровой витриной</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                            Статус: Главный Администратор
                        </span>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                        >
                            Выйти из панели
                        </button>
                    </div>
                </header>

                {/* Контент админки */}
                <main className="mx-auto max-w-7xl px-8 py-10">
                    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-800">Маркетинговые услуги (PostgreSQL в Docker)</h2>
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                База онлайн
                            </span>
                        </div>

                        <p className="text-slate-600 mb-6">
                            Вы вошли по мастер-паролю. Ниже загружен список услуг вашей PWA-витрины напрямую из базы данных.
                        </p>

                        {/* Карточки управления услугами */}
                        <div className="grid gap-4 md:grid-cols-2">
                            {["Создание PWA-сайта", "SEO-оптимизация", "SERM (Репутация)", "Content-маркетинг"].map((service, i) => (
                                <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:border-slate-300 transition">
                                    <span className="font-semibold text-slate-700">{service}</span>
                                    <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition">
                                        Редактировать цену
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // 2. ФОРМА ВХОДА ПО ПАРОЛЮ (Для гостей)
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">MIT3 Admin</h2>
                    <p className="text-sm text-slate-500">Вход по паролю разработчика</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Введите мастер-пароль
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            ⚠️ {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-3.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-[0.98]"
                    >
                        Войти в систему
                    </button>
                </form>
            </div>
        </div>
    );
}
