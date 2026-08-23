"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { Category, Service } from "@prisma/client";

// Строгий тип: Направление, внутри которого гарантированно идёт массив Услуг
type CategoryWithServices = Category & {
  services: Service[];
};

export default function HomePage() {
  const { data: categories } = api.marketing.getCategories.useQuery();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    message: "",
    serviceId: "",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const submitLead = api.marketing.createLead.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate(form);
  };

  const safeCategories = categories ?? [];

  // Защита от Hydration Error в строгом WebKit Safari
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-slate-400 font-medium animate-pulse">Загрузка интерфейса MIT3...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Шапка сайта */}
      <header className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 rounded-b-2xl shadow-sm">
        <span className="text-xl font-black tracking-tight text-blue-600">⚡ MIT3.RU</span>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition">О проекте</a>
          <a href="#catalog" className="hover:text-blue-600 transition">Услуги</a>
          <a href="#contacts" className="hover:text-blue-600 transition">Контакты</a>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-20">
        {/* Информационный хаб */}
        <section id="about" className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
            Комплексный цифровой маркетинг и разработка
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Создаем современные PWA-сайты, проектируем сложные модульные системы и выводим бизнес в ТОП поисковых систем Яндекс и Google с помощью продвинутых SEO-технологий.
          </p>
        </section>

        {/* Секция: Динамический каталог услуг из PostgreSQL */}
        <section id="catalog" className="space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Направления услуг</h2>
            <p className="mt-2 text-sm text-slate-500">Выберите необходимую услугу для автоматического прикрепления к расчету стоимости</p>
          </div>

          {safeCategories.length > 0 ? (
            <div className="space-y-12">
              {safeCategories.map((category: CategoryWithServices) => (
                <div key={category.id} className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    {category.title}
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {category.services && category.services.length > 0 ? (
                      category.services.map((service: Service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, serviceId: service.id }))}
                          className={`group flex flex-col text-left bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ${form.serviceId === service.id
                              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                              : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
                            }`}
                        >
                          <div className="flex items-start justify-between w-full gap-4">
                            <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {service.title}
                            </h4>
                            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md shrink-0">
                              от {service.priceFrom} ₽
                            </span>
                          </div>
                          <p className="mt-2 text-slate-600 text-sm leading-relaxed flex-grow">
                            {service.seoDescription ?? "Описание услуги наполняется в панели управления."}
                          </p>
                          <div className="mt-4 text-xs font-semibold text-slate-400 group-hover:text-slate-500 transition-colors">
                            {form.serviceId === service.id ? "✓ Услуга выбрана" : "+ Выбрать для расчета"}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">В данном направлении пока нет активных услуг.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-slate-500 font-medium">Каталог услуг пуст.</p>
              <p className="text-slate-400 text-sm mt-1">Зайдите в админку, чтобы создать первое направление и дочерние услуги.</p>
            </div>
          )}
        </section>

        {/* Форма лидогенерации */}
        <section id="contacts" className="grid gap-12 lg:grid-cols-2 items-start border-t border-slate-200 pt-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Рассчитать стоимость</h2>
            <p className="text-slate-600 leading-relaxed">
              Оставьте контакты и выберите интересующее направление. Система автоматически сформирует спецификацию проекта на основе модулей цен базы данных.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ваше имя</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Иван Иванов"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Телефон или Telegram</label>
              <input
                type="text"
                required
                value={form.contact}
                onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="+7 (999) 000-00-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Комментарий к проекту</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition h-28 resize-none"
                placeholder="Расскажите вкратце о ваших задачах..."
              />
            </div>

            {submitLead.isSuccess && (
              <p className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                🎉 Спасибо! Заявка успешно отправлена!
              </p>
            )}

            <button
              type="submit"
              disabled={submitLead.isPending}
              className="w-full rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.99] disabled:opacity-50"
            >
              {submitLead.isPending ? "Отправка..." : "Отправить форму заявки"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
