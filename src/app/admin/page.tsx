"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<"categories" | "services">("categories");

    // Состояние полей для создания Направления
    const [categoryForm, setCategoryForm] = useState({
        title: "", slug: "", description: "", h1: "",
        seoTitle: "", seoDescription: "", seoKeywords: "",
        ogTitle: "", ogImage: "",
    });

    // 👇 НОВОЕ: Состояние полей для создания Конечной Услуги
    const [serviceForm, setServiceForm] = useState({
        title: "", slug: "", categoryId: "", priceFrom: 0,
        seoDescription: "",
    });

    // Получаем функцию обновления данных с бэкенда через tRPC
    const { data: categories, refetch: refetchCategories } = api.marketing.getCategories.useQuery();

    // Настройка tRPC-мутации для записи Направления в PostgreSQL
    const createCategory = api.marketing.createCategory.useMutation({
        onSuccess: () => {
            alert("🎉 Направление успешно создано и записано в базу!");
            setCategoryForm({
                title: "", slug: "", description: "", h1: "",
                seoTitle: "", seoDescription: "", seoKeywords: "",
                ogTitle: "", ogImage: ""
            });
            void refetchCategories();
        },
        onError: (err) => alert(`❌ Ошибка базы данных: ${err.message}`),
    });

    // 👇 НОВОЕ: Настройка tRPC-мутации для записи Услуги в PostgreSQL
    const createService = api.marketing.createService.useMutation({
        onSuccess: () => {
            alert("💼 Конечная услуга успешно привязана к направлению и записана!");
            setServiceForm({ title: "", slug: "", categoryId: "", priceFrom: 0, seoDescription: "" });
            void refetchCategories(); // Перезапрашиваем структуру для главной страницы
        },
        onError: (err) => alert(`❌ Ошибка базы данных: ${err.message}`),
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "mit3_super_secret_2026") {
            setIsAuthenticated(true);
        } else {
            alert("❌ Неверный мастер-пароль разработчика!");
        }
    };

    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        createCategory.mutate(categoryForm);
    };

    // 👇 НОВОЕ: Функция отправки формы создания Услуги
    const handleCreateService = (e: React.FormEvent) => {
        e.preventDefault();
        createService.mutate({
            ...serviceForm,
            priceFrom: Number(serviceForm.priceFrom), // Принудительно приводим к числу для базы данных
        });
    };

    // ЭКРАН 1: АВТОРИЗАЦИЯ ШЛЮЗА БЕЗОПАСНОСТИ
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans px-4">
                <form onSubmit={handleLogin} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <span className="text-3xl">🔑</span>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">MIT3 GATEWAY</h1>
                        <p className="text-sm text-slate-400">Введите мастер-пароль для входа в панель</p>
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-center font-mono text-lg tracking-widest text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                            placeholder="••••••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition active:scale-[0.99]">
                        Проверить подпись сессии
                    </button>
                </form>
            </div>
        );
    }

    // ЭКРАН 2: ПОЛНОЦЕННАЯ ПАНЕЛЬ УПРАВЛЕНИЯ MARKETING AUTOMATION
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
            {/* Боковое меню навигации */}
            <aside className="w-full md:w-64 bg-slate-950 text-slate-400 p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="font-black text-white tracking-tight">MIT3 CORE v1.5</span>
                    </div>

                    <nav className="space-y-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab("categories")}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-3 ${activeTab === "categories" ? "bg-blue-600 text-white" : "hover:bg-slate-900 hover:text-slate-200"}`}
                        >
                            📁 Направления (Хабы)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("services")}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-3 ${activeTab === "services" ? "bg-blue-600 text-white" : "hover:bg-slate-900 hover:text-slate-200"}`}
                        >
                            💼 Конечные услуги
                        </button>
                    </nav>
                </div>

                <div className="text-xs border-t border-slate-800 pt-4 space-y-1">
                    <p className="text-slate-500">Статус системы:</p>
                    <p className="text-emerald-400 font-semibold">База PostgreSQL онлайн</p>
                </div>
            </aside>
            {/* Основная рабочая область контента */}
            <main className="flex-grow p-6 md:p-10 max-w-5xl space-y-8 overflow-y-auto">
                {/* Вкладка 1: Управление Направлениями */}
                {activeTab === "categories" && (
                    <div className="space-y-6">
                        <div className="border-b border-slate-200 pb-4">
                            <h2 className="text-2xl font-bold tracking-tight">Создание верхнего уровня: Направления</h2>
                            <p className="text-sm text-slate-500 mt-1">Здесь создаются основные разделы (Разработка, SEO, Маркетинг) со сквозными мета-тегами [1.1].</p>
                        </div>

                        <form onSubmit={handleCreateCategory} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Название (Видимое)</label>
                                    <input type="text" required value={categoryForm.title} onChange={(e) => setCategoryForm(prev => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition" placeholder="Разработка сайтов" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ЧПУ Ссылка (Slug английскими)</label>
                                    <input type="text" required value={categoryForm.slug} onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition" placeholder="razrabotka" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Главный заголовок страницы H1</label>
                                <input type="text" value={categoryForm.h1} onChange={(e) => setCategoryForm(prev => ({ ...prev, h1: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition" placeholder="Профессиональная разработка цифровых решений" />
                            </div>

                            {/* УЛЬТИМАТИВНЫЙ SEO И OPEN GRAPH БЛОК */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
                                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">🚀 Параметры продвижения (SEO & Open Graph)</h4>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">SEO Title (Заголовок во вкладке)</label>
                                        <input type="text" value={categoryForm.seoTitle} onChange={(e) => setCategoryForm(prev => ({ ...prev, seoTitle: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" placeholder="Разработка PWA и веб-приложений в Москве" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Ключевые слова (Keywords)</label>
                                        <input type="text" value={categoryForm.seoKeywords} onChange={(e) => setCategoryForm(prev => ({ ...prev, seoKeywords: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" placeholder="создание pwa, заказать сайт, агентство разработка" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">SEO Description (Сниппет в Яндексе/Google)</label>
                                    <textarea value={categoryForm.seoDescription} onChange={(e) => setCategoryForm(prev => ({ ...prev, seoDescription: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none h-16 resize-none" placeholder="Закажите разработку высокотехнологичных прогрессивных систем от диджитал-агентства MIT3..." />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 border-t border-slate-200/60 pt-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Заголовок ссылки для Telegram (Open Graph Title)</label>
                                        <input type="text" value={categoryForm.ogTitle} onChange={(e) => setCategoryForm(prev => ({ ...prev, ogTitle: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" placeholder="Услуги разработки от MIT3 Агентства" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Ссылка на превью картинку карточки в Telegram</label>
                                        <input type="text" value={categoryForm.ogImage} onChange={(e) => setCategoryForm(prev => ({ ...prev, ogImage: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" placeholder="https://mit3.ru" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={createCategory.isPending} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50">
                                {createCategory.isPending ? "Запись в базу PostgreSQL..." : "Создать направление и вшить мета-данные"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Вкладка 2: Управление Конечными Услугами */}
                {activeTab === "services" && (
                    <div className="space-y-6">
                        <div className="border-b border-slate-200 pb-4">
                            <h2 className="text-2xl font-bold tracking-tight">Создание среднего уровня: Конечные услуги</h2>
                            <p className="text-sm text-slate-500 mt-1">Привязка конкретных коммерческих продуктов к направлениям верхнего уровня.</p>
                        </div>

                        <form onSubmit={handleCreateService} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Родительское направление</label>
                                    <select required value={serviceForm.categoryId} onChange={(e) => setServiceForm(prev => ({ ...prev, categoryId: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition">
                                        <option value="">-- Выберите направление --</option>
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Название услуги</label>
                                    <input type="text" required value={serviceForm.title} onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition" placeholder="Разработка PWA под ключ" />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ЧПУ Ссылка (Slug услуги)</label>
                                    <input type="text" required value={serviceForm.slug} onChange={(e) => setServiceForm(prev => ({ ...prev, slug: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition" placeholder="pwa-development" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Стоимость от (₽)</label>
                                    <input type="number" required value={serviceForm.priceFrom} onChange={(e) => setServiceForm(prev => ({ ...prev, priceFrom: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition" placeholder="49000" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Краткое SEO Описание (Для карточки на главной)</label>
                                <input type="text" required value={serviceForm.seoDescription} onChange={(e) => setServiceForm(prev => ({ ...prev, seoDescription: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition" placeholder="Прогрессивные веб-приложения с мгновенной установкой на экраны iPhone и Android без App Store." />
                            </div>

                            <button type="submit" disabled={createService.isPending} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50">
                                {createService.isPending ? "Связываю таблицы..." : "Опубликовать коммерческую услугу"}
                            </button>
                        </form>
                    </div>
                )}

            </main>
        </div>
    );
}
