"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { ServiceSector, Service } from "@prisma/client";

export default function AdminPage() {
    // Использование безопасных типов новой схемы вместо Category
    const [sectors, setSectors] = useState<ServiceSector[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedSectorId, setSelectedSectorId] = useState<string>("");

    // Состояния для форм управления коммерческим каталогом
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<"services" | "mediacentr">("services");

    // Состояния для полей создания новой услуги
    const [serviceName, setServiceName] = useState("");
    const [titleH1, setTitleH1] = useState("");
    const [description, setDescription] = useState("");
    const [priceFrom, setPriceFrom] = useState<number>(0);
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDesc, setMetaDesc] = useState("");

    // TRPC Процедуры для безопасного обмена данными с Prisma на бэкенде
    const utils = api.useUtils();

    // Получаем список направлений (бывших категорий) напрямую из БД
    const { data: dbSectors, isLoading: sectorsLoading } = api.post.getSectors?.useQuery() ?? { data: null, isLoading: false };
    // Описываем мутации TRPC под новые типы нашей базы данных
    const createServiceMutation = api.post.createService?.useMutation({
        onSuccess: async () => {
            // Сбрасываем форму после успешного сохранения услуги
            setServiceName("");
            setTitleH1("");
            setDescription("");
            setPriceFrom(0);
            setMetaTitle("");
            setMetaDesc("");
            alert("Услуга успешно добавлена в каталог и оптимизирована для SEO!");
            // Перезапрашиваем данные, чтобы обновить списки у роботов и в админке
            if (utils.post.getServicesBySector) {
                await utils.post.getServicesBySector.invalidate({ sectorId: selectedSectorId });
            }
        },
        onError: (err) => {
            console.error("Ошибка при создании услуги:", err);
            alert("Не удалось сохранить услугу. Проверьте правильность заполнения полей.");
        }
    }) ?? { mutate: () => { console.warn("TRPC процедура createService не найдена."); } };

    // Функция отправки коммерческой формы на бэкенд
    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSectorId) {
            alert("Пожалуйста, выберите направление услуг (Сектор) перед сохранением!");
            return;
        }
        if (!serviceName || !titleH1 || priceFrom <= 0) {
            alert("Заполните обязательные поля: Название, Заголовок H1 и Минимальную стоимость!");
            return;
        }

        setIsSubmitting(true);
        try {
            createServiceMutation.mutate({
                sectorId: selectedSectorId,
                name: serviceName,
                titleH1,
                description,
                priceFrom,
                metaTitle: metaTitle || serviceName,
                metaDesc: metaDesc || description,
                // Передаем валидные JSON-болванки, чтобы линтер в докере не ругался на пустые ячейки
                features: JSON.stringify([]),
                tariffs: JSON.stringify([]),
                faq: JSON.stringify([]),
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">

                {/* Шапка админ-панели */}
                <header className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            <span>🛠️</span> Управление контентом
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">Архитектурный центр настройки SEO-каталога и Медиацентра.</p>
                    </div>

                    {/* Переключение вкладок управления */}
                    <div className="flex rounded-xl bg-slate-100 p-1">
                        <button
                            onClick={() => setActiveTab("services")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === "services" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            Каталог услуг
                        </button>
                        <button
                            onClick={() => setActiveTab("mediacentr")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === "mediacentr" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            Медиацентр
                        </button>
                    </div>
                </header>

                {activeTab === "services" ? (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Левая колонка: Выбор сектора услуг */}
                        <div className="lg:col-span-1 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">1. Направление услуг</h2>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Выберите сектор</label>
                            <select
                                value={selectedSectorId}
                                onChange={(e) => setSelectedSectorId(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            >
                                <option value="">-- Выбрать направление --</option>
                                {dbSectors?.map((sector) => (
                                    <option key={sector.id} value={sector.id}>
                                        {/* Исправлено: Выводим поле name вместо убранного title */}
                                        {sector.name}
                                    </option>
                                ))}
                            </select>
                            {sectorsLoading && <p className="mt-2 text-xs text-slate-400 animate-pulse">Загрузка секторов из Prisma...</p>}
                        </div>
                        {/* Правая колонка: Форма создания и настройки услуги */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleServiceSubmit} className="space-y-6">
                                <div className="border-b border-slate-100 pb-4">
                                    <h2 className="text-lg font-bold text-slate-900">2. Параметры посадочной страницы</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Данные автоматически попадут в микроразметку Product для Яндекса и Google.</p>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Название услуги (для списков)</label>
                                        <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="Например: Проектирование PWA-платформ" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Минимальная стоимость (руб.)</label>
                                        <input type="number" value={priceFrom || ""} onChange={(e) => setPriceFrom(Number(e.target.value))} placeholder="120000" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Главный заголовок страницы (H1)</label>
                                    <input type="text" value={titleH1} onChange={(e) => setTitleH1(e.target.value)} placeholder="Например: Разработка цифровых PWA-хабов для бизнеса под ключ" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Основное продающее описание (Description)</label>
                                    <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опишите ценность продукта, боли ЦА и главные преимущества перед CMS-системами..." className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"></textarea>
                                </div>

                                <div className="rounded-2xl border border-dashed border-slate-200 p-5 space-y-4 bg-slate-50/30">
                                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1">🔍 Блок мета-тегов SEO</h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Meta Title</label>
                                            <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="До 60 символов с ключевыми словами" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-sky-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Meta Description</label>
                                            <input type="text" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="До 160 символов для сниппета выдачи" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-sky-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button type="submit" disabled={isSubmitting} className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 disabled:bg-slate-300 transition">
                                        {isSubmitting ? "Сохранение..." : "Опубликовать услугу в каталог"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <span className="text-2xl">📝</span>
                        <h3 className="mt-2 font-bold text-slate-700">Управление Медиацентром</h3>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">Интерфейс для добавления ежедневных статей и новостей будет использовать модель Post.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
