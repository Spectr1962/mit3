"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { Category, Service } from "@prisma/client";

export const dynamic = "force-dynamic";

// Масштабируемая конфигурация меню
const NAVIGATION_LINKS = [
  { label: "О проекте", id: "about" },
  { label: "Услуги", id: "services" },
  { label: "Портфолио", id: "portfolio" },
  { label: "Блог", id: "blog" },
  { label: "Контакты", id: "contact" },
];

// Временные данные для портфолио
const PORTFOLIO_PROJECTS = [
  {
    title: "PWA для доставки еды",
    description: "Разработали прогрессивное приложение. Конверсия выросла на 35% за счет мгновенной загрузки.",
    tag: "Кейс: PWA",
  },
  {
    title: "SEO-продвижение завода",
    description: "Вывели 140+ запросов в ТОП-3 Яндекса. Органический трафик вырос до 5000 посетителей.",
    tag: "Кейс: SEO",
  },
];

export default function Home() {
  const { data: services } = api.marketing.getCategories.useQuery();
  const { data: posts } = api.marketing.getPosts.useQuery();

  const submitLead = api.marketing.createLead.useMutation({
    onSuccess: () => {
      alert("Заявка успешно отправлена!");
      setForm({ name: "", contact: "", message: "", serviceId: "" });
    },
  });

  const [form, setForm] = useState({ name: "", contact: "", message: "", serviceId: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate(form);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-16">

      {/* ШАПКА САЙТА И НАВИГАЦИЯ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <a href="#" className="text-xl font-black tracking-tight text-blue-600">⚡️ DIGITAL.AGENCY</a>

          <nav className="hidden md:flex items-center gap-6">
            {NAVIGATION_LINKS.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                {link.label}
              </a>
            ))}
            <a href="#contact" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
              Заказать проект
            </a>
          </nav>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-600">
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 bg-white border-t border-slate-100 pt-4 pb-2 flex flex-col gap-3">
            {NAVIGATION_LINKS.map((link) => (
              <a key={link.id} href={`#${link.id}`} onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 px-2">
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
      {/* 🚀 1. БЛОК: О ПРОЕКТЕ (HERO) */}
      <section id="about" className="bg-white border-b border-slate-100 px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase">О проекте</span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Помогаю бизнесу расти в цифровой среде
          </h1>
          <p className="mt-6 text-xl text-slate-600 leading-relaxed">
            Я занимаюсь комплексным цифровым маркетингом. Создаю современные PWA-сайты, вывожу проекты в ТОП поисковиков и настраиваю стабильный поток клиентов. Этот сайт — демонстрация технологичного MVP на T3-стеке.
          </p>
          <div className="mt-10">
            <a href="#contact" className="inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-none">
              Обсудить проект
            </a>
          </div>
        </div>
      </section>

      {/* 🛠️ 2. БЛОК: УСЛУГИ (КАТАЛОГ) */}
      <section id="services" className="mx-auto max-w-5xl px-6 py-20 scroll-mt-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Что я делаю</span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-1">Каталог Услуг</h2>
          <p className="mt-2 text-slate-600">Нажмите на карточку услуги, чтобы прикрепить её к форме заявки</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {services?.map((category: Category & { services: Service[] }) => (
            <div key={category.id} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{category.title}</h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.services?.map((service: Service) => (
                  <div key={service.id} className="group flex flex-col bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:border-blue-500 transition-all">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{service.title}</h3>
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">{service.priceFrom} ₽</span>
                    </div>
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed flex-grow">{service.seoDescription ?? ""}</p>

                    <div className="mt-4 text-xs font-medium text-slate-400">
                      {form.serviceId === service.id ? "✓ Услуга выбрана" : "+ Выбрать для расчета стоимости"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 💼 3. БЛОК: ПОРТФОЛИО (КЕЙСЫ) */}
      <section id="portfolio" className="bg-white border-y border-slate-200/60 px-6 py-20 scroll-mt-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Результаты</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-1">Портфолио проектов</h2>
            <p className="mt-2 text-slate-600">Реальные цифры и выполненные задачи</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {PORTFOLIO_PROJECTS.map((project, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{project.tag}</span>
                <h3 className="text-xl font-bold mt-4 mb-2">{project.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 📝 4. БЛОК: БЛОГ (ПОЛЕЗНЫЕ МАТЕРИАЛЫ) */}
      <section id="blog" className="px-6 py-20 scroll-mt-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Экспертиза</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-1">Блог об интернет-маркетинге</h2>
            <p className="mt-2 text-slate-600">Делюсь инсайтами, которые внедряю клиентам</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {posts?.map((post: any) => (
              <article key={post.id} className="flex flex-col bg-white rounded-2xl p-6 shadow-sm border border-slate-200/40">
                <span className="text-xs text-slate-400 mb-2">⏱️ {post.readTime} чтения</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h3>
                <p className="text-slate-600 text-sm flex-1 mb-4">{post.excerpt}</p>
                <a href="#contact" className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-auto">
                  Обсудить стратегию →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ✉️ 5. БЛОК: КОНТАКТЫ (ОСТАВЛЕНИЕ ЗАЯВКИ) */}
      <section id="contact" className="mx-auto max-w-xl px-6 py-20 scroll-mt-16">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl shadow-slate-100">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Связь</span>
            <h2 className="text-2xl font-bold mt-1">Начать сотрудничество</h2>
            <p className="text-sm text-slate-500 mt-1">Единственный шаг к росту ваших конверсий</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Ваше имя</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Константин"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Telegram / Телефон</label>
              <input
                type="text"
                required
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="@username или +7..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Опишите задачу (необязательно)</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Что продвигаем? Какой текущий результат?"
              />
            </div>

            {form.serviceId && (
              <div className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg flex justify-between items-center">
                <span>Выбранная услуга: <strong>{services?.find(s => s.id === form.serviceId)?.title}</strong></span>
                <button type="button" onClick={() => setForm({ ...form, serviceId: "" })} className="text-blue-400 hover:text-blue-600 font-bold">×</button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitLead.isPending}
              className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 shadow-md shadow-blue-500/10"
            >
              {submitLead.isPending ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        </div>
      </section>

    </main>
  );
}
