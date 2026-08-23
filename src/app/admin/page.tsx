"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { Category, Service } from "@prisma/client";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<"categories" | "services">("categories");

    // Режимы работы форм ("create" - создание нового, "edit" - редактирование существующего)
    const [categoryMode, setCategoryMode] = useState<"create" | "edit">("create");
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    const [serviceMode, setServiceMode] = useState<"create" | "edit">("create");
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

    // Состояния для форм
    const [categoryForm, setCategoryForm] = useState({
        title: "", slug: "", description: "", h1: "",
        seoTitle: "", seoDescription: "", seoKeywords: "",
        ogTitle: "", ogImage: "",
    });

    const [serviceForm, setServiceForm] = useState({
        title: "", slug: "", categoryId: "", priceFrom: 0,
        seoDescription: "",
    });

    // Запросы данных с бэкенда через tRPC
    const { data: categories, refetch: refetchCategories } = api.marketing.getCategories.useQuery();

    // === МУТАЦИИ НАПРАВЛЕНИЙ ===
    const createCategory = api.marketing.createCategory.useMutation({
        onSuccess: () => {
            alert("🎉 Направление успешно создано!");
            resetCategoryForm();
            void refetchCategories();
        },
        onError: (err) => alert(`❌ Ошибка базы данных: ${err.message}`),
    });

    const updateCategory = api.marketing.updateCategory.useMutation({
        onSuccess: () => {
            alert("✏️ Направление успешно обновлено!");
            resetCategoryForm();
            void refetchCategories();
        },
        onError: (err) => alert(`❌ Ошибка обновления: ${err.message}`),
    });

    // === МУТАЦИИ УСЛУГ ===
    const createService = api.marketing.createService.useMutation({
        onSuccess: () => {
            alert("💼 Конечная услуга успешно создана!");
            resetServiceForm();
            void refetchCategories();
        },
        onError: (err) => alert(`❌ Ошибка базы данных: ${err.message}`),
    });

    const updateService = api.marketing.updateService.useMutation({
        onSuccess: () => {
            alert("✏️ Услуга успешно обновлена!");
            resetServiceForm();
            void refetchCategories();
        },
        onError: (err) => alert(`❌ Ошибка обновления: ${err.message}`),
    });

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ОЧИСТКИ ===
    const resetCategoryForm = () => {
        setCategoryForm({ title: "", slug: "", description: "", h1: "", seoTitle: "", seoDescription: "", seoKeywords: "", ogTitle: "", ogImage: "" });
        setCategoryMode("create");
        setEditingCategoryId(null);
    };

    const resetServiceForm = () => {
        setServiceForm({ title: "", slug: "", categoryId: "", priceFrom: 0, seoDescription: "" });
        setServiceMode("create");
        setEditingServiceId(null);
    };

    // === ОБРАБОТЧИКИ ОТПРАВКИ ФОРМ ===
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "mit3_super_secret_2026") {
            setIsAuthenticated(true);
        } else {
            alert("❌ Неверный мастер-пароль разработчика!");
        }
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryMode === "edit" && editingCategoryId) {
            updateCategory.mutate({ id: editingCategoryId, ...categoryForm });
        } else {
            createCategory.mutate(categoryForm);
        }
    };

    const handleServiceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...serviceForm, priceFrom: Number(serviceForm.priceFrom) };
        if (serviceMode === "edit" && editingServiceId) {
            updateService.mutate({ id: editingServiceId, ...payload });
        } else {
            createService.mutate(payload);
        }
    };

    // === ЗАПУСК РЕДАКТИРОВАНИЯ (ПОДСТАНОВКА ДАННЫХ В ИНПУТЫ) ===
    const startEditCategory = (category: Category) => {
        setCategoryMode("edit");
        setEditingCategoryId(category.id);
        setCategoryForm({
            title: category.title,
            slug: category.slug,
            description: category.description ?? "",
            h1: category.h1 ?? "",
            seoTitle: category.seoTitle ?? "",
            seoDescription: category.seoDescription ?? "",
            seoKeywords: category.seoKeywords ?? "",
            ogTitle: category.ogTitle ?? "",
            ogImage: category.ogImage ?? "",
        });
    };

    const startEditService = (service: Service) => {
        setServiceMode("edit");
        setEditingServiceId(service.id);
        setServiceForm({
            title: service.title,
            slug: service.slug,
            categoryId: service.categoryId,
            priceFrom: service.priceFrom,
            seoDescription: service.seoDescription ?? "",
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

                {/* Вкладка 1: Управление Направлениями */}
                {activeTab === "categories" && (
                    <div className="space-y-10">
                        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    {categoryMode === "edit" ? "✏️ Редактирование направления" : "📁 Создание направления"}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Управление разделами сайта, SEO и Open Graph разметкой хабов [1.1].</p>
                            </div>
                            {categoryMode === "edit" && (
                                <button type="button" onClick={resetCategoryForm} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                                    Отменить редактирование
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleCategorySubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
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

                            <button type="submit" disabled={createCategory.isPending || updateCategory.isPending} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50">
                                {categoryMode === "edit" ? "Сохранить изменения хаба" : "Создать направление и вшить мета-данные"}
                            </button>
                        </form>

                        {/* СПИСОК СУЩЕСТВУЮЩИХ НАПРАВЛЕНИЙ ДЛЯ РЕДАКТИРОВАНИЯ */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold tracking-tight text-slate-800">Активные направления в базе PostgreSQL</h3>
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                {categories && categories.length > 0 ? (
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4">Название хаба</th>
                                                <th className="px-6 py-4">Адрес (Slug)</th>
                                                <th className="px-6 py-4 text-right">Действие</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {categories.map((cat: any) => (
                                                <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                                                    <td className="px-6 py-4 font-semibold text-slate-900">{cat.title}</td>
                                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">/services/{cat.slug}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button type="button" onClick={() => startEditCategory(cat)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm">
                                                            ✏️ Редактировать
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="p-6 text-center text-slate-400 text-sm">Направления ещё не созданы.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}


            </main>
        </div>
    );
}
