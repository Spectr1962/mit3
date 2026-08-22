"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const utils = api.useUtils();

    const { data: services, isLoading } = api.marketing.getServices.useQuery();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: "", slug: "", description: "", priceFrom: "" });

    const createMutation = api.marketing.createService.useMutation({
        onSuccess: () => {
            void utils.marketing.getServices.invalidate();
            resetForm();
        },
    });

    const updateMutation = api.marketing.updateService.useMutation({
        onSuccess: () => {
            void utils.marketing.getServices.invalidate();
            resetForm();
        },
    });

    const deleteMutation = api.marketing.deleteService.useMutation({
        onSuccess: () => {
            void utils.marketing.getServices.invalidate();
        },
    });

    const resetForm = () => {
        setForm({ title: "", slug: "", description: "", priceFrom: "" });
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, ...form });
        } else {
            createMutation.mutate(form);
        }
    };

    const handleEdit = (service: { id: string; title: string; slug: string; description: string; priceFrom: string }) => {
        setEditingId(service.id);
        setForm({
            title: service.title,
            slug: service.slug,
            description: service.description,
            priceFrom: service.priceFrom,
        });
    }; // <-- УБЕДИСЬ, ЧТО ЗДЕСЬ СТОИТ ЗАКРЫВАЮЩАЯ СКОБКА С ТОЧКОЙ С ЗАПЯТОЙ

    if (status === "loading" || isLoading) {
        return <div className="p-8 text-center text-slate-500">Загрузка панели управления...</div>;
    }

    if (!session) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl border border-slate-200/60">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Вход в админку</h1>
                    <p className="text-sm text-slate-500 mb-6">Доступ разрешен только владельцу цифровой витрины.</p>
                    <button
                        onClick={() => void signIn("github")}
                        className="w-full rounded-xl bg-slate-900 py-3.5 font-semibold text-white hover:bg-slate-800 transition-colors shadow-md"
                    >
                        Войти через GitHub
                    </button>
                </div>
            </div>
        );
    }
    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900 font-sans">
            <div className="mx-auto max-w-5xl">

                {/* Шапка админ-панели */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Панель управления</h1>
                        <p className="text-slate-500 text-sm mt-1">Администратор: <span className="font-semibold text-slate-700">{session.user?.email}</span></p>
                    </div>
                    <button
                        onClick={() => void signOut()}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                        Выйти
                    </button>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">

                    {/* Форма Создания и Редактирования услуг */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm h-fit">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {editingId ? "📝 Редактировать" : "✨ Добавить услугу"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Название услуги</label>
                                <input
                                    type="text" required value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
                                    placeholder="Например: SEO-оптимизация"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Slug (Часть URL)</label>
                                <input
                                    type="text" required value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
                                    placeholder="seo-optimization"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Стоимость (от)</label>
                                <input
                                    type="text" required value={form.priceFrom}
                                    onChange={(e) => setForm({ ...form, priceFrom: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
                                    placeholder="40 000 ₽"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Описание услуги</label>
                                <textarea
                                    required rows={4} value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
                                    placeholder="Подробно опишите, что входит в услугу..."
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                >
                                    {editingId ? "Сохранить" : "Создать"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button" onClick={resetForm}
                                        className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium hover:bg-slate-200 text-slate-700 transition-colors"
                                    >
                                        Отмена
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    {/* Список текущих услуг из базы Docker */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Текущие услуги на витрине</h2>

                        {services?.length === 0 && (
                            <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-sm">
                                Услуг пока нет. Создайте первую услугу с помощью формы слева.
                            </div>
                        )}

                        {services?.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                            >
                                <div className="max-w-md">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-slate-900">{service.title}</h3>
                                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-lg">{service.priceFrom}</span>
                                    </div>
                                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">{service.description}</p>
                                </div>
                                <div className="flex gap-2 self-end sm:self-center">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="text-xs font-semibold bg-slate-100 text-slate-700 px-3.5 py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => { if (confirm("Удалить услугу из базы данных?")) deleteMutation.mutate({ id: service.id }) }}
                                        className="text-xs font-semibold bg-red-50 text-red-600 px-3.5 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </main>
    );
}
