import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Проектирование и разработка цифровых PWA-хабов для бизнеса",
    description: "Создаем высокотехнологичные PWA-платформы нового поколения на Next.js под ключ. Offline-режим, установка на экран смартфона в 1 клик, бесплатные Push-уведомления вместо дорогих SMS.",
};

export default function DevelopmentServicePage() {
    return (
        <main className="container mx-auto px-4 py-16">
            {/* 1 экран: Точка входа и позиционирование */}
            <section className="max-w-4xl mx-auto text-center mb-16">
                <span className="text-sm font-semibold tracking-wider text-sky-600 uppercase bg-sky-50 px-3 py-1 rounded-full">
                    Технологии будущего
                </span>
                <h1 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-tight">
                    Разработка цифровых PWA-хабов <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                        вместо устаревших сайтов на CMS
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Эра классических сайтов на Tilda и WordPress уходит в прошлое. Мы создаем отказоустойчивые веб-приложения на Next.js (T3 Stack), которые захватывают рынок благодаря мгновенной скорости работы и возможностям нативных приложений.
                </p>
            </section>

            {/* 2 экран: Маркетинговые триггеры PWA */}
            <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                <div className="p-6 border rounded-2xl bg-card shadow-sm">
                    <div className="text-2xl mb-3">📲</div>
                    <h3 className="text-lg font-bold mb-2">Установка в 1 клик</h3>
                    <p className="text-sm text-muted-foreground">Клиент добавляет ваш бизнес-хаб на экран телефона в обход AppStore и GooglePlay.</p>
                </div>
                <div className="p-6 border rounded-2xl bg-card shadow-sm">
                    <div className="text-2xl mb-3">🔔</div>
                    <h3 className="text-lg font-bold mb-2">Бесплатные Push-пуши</h3>
                    <p className="text-sm text-muted-foreground">Напоминайте о записях, акциях и статусах заказов. Полностью заменяет дорогой бюджет на SMS-рассылки.</p>
                </div>
                <div className="p-6 border rounded-2xl bg-card shadow-sm">
                    <div className="text-2xl mb-3">📡</div>
                    <h3 className="text-lg font-bold mb-2">Автономный Offline-режим</h3>
                    <p className="text-sm text-muted-foreground">Благодаря сервис-воркерам, каталоги, интерактивные брифы и личные кабинеты работают даже без интернета.</p>
                </div>
            </section>

            {/* 3 экран: Динамический блок отраслевого портфолио */}
            <section className="max-w-4xl mx-auto text-center border-t pt-12">
                <h2 className="text-2xl font-bold mb-4">Отраслевая экспертиза и кейсы</h2>
                <p className="text-muted-foreground mb-6">
                    Мы адаптируем PWA-платформу под специфику любой ниши: от медицины и автошкол до заводов металлоконструкций. Подробные разборы решений выходят каждый день в нашем Медиацентре.
                </p>
                {/* В будущем здесь будет интерактивный клиентский React-компонент с фильтрацией кейсов из Prisma */}
                <div className="inline-block px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground font-mono">
                    [Блок подгрузки кейсов из базы данных готов к интеграции]
                </div>
            </section>
        </main>
    );
}
