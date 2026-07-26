"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";

export function Tracker() {
    const pathname = usePathname();

    // Используем tRPC мутацию для фоновой записи логов активности
    const trackMutation = api.admin.trackAction.useMutation();

    // Реф для предотвращения дублирования логов при двойном рендере в React StrictMode
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // Если этот путь уже залогирован на этом цикле — пропускаем (оптимизация)
        if (lastTrackedPath.current === pathname) return;
        lastTrackedPath.current = pathname;

        // Скрипт-переводчик: превращает URL в понятное b2b описание действия
        let actionDescription = `Просмотр страницы: ${pathname}`;

        if (pathname === "/") {
            actionDescription = "Посетил главную промо-страницу платформы MIT3";
        } else if (pathname === "/services") {
            actionDescription = "Изучает Матрицу экосистемы (список 7 VIP-услуг)";
        } else if (pathname.startsWith("/services/")) {
            const slug = pathname.replace("/services/", "");
            actionDescription = `Изучает детальные тарифы и подразделы модуля: MIT3.${slug.toUpperCase()}`;
        } else if (pathname === "/cases") {
            actionDescription = "Просматривает b2b-архив достижений (портфолио кейсов)";
        } else if (pathname.startsWith("/cases/")) {
            const slug = pathname.replace("/cases/", "");
            actionDescription = `Разбирает технические решения и KPI в кейсе: ${slug}`;
        } else if (pathname === "/media") {
            actionDescription = "Читает ленту Медиацентра (экспертный блог и новости)";
        } else if (pathname.startsWith("/media/")) {
            const slug = pathname.replace("/media/", "");
            actionDescription = `Изучает экспертную статью / новость со slug: ${slug}`;
        } else if (pathname === "/contacts") {
            actionDescription = "Зашел на страницу контактов (потенциальный лид)";
        } else if (pathname === "/privacy") {
            actionDescription = "Изучает правовые документы (Политику обработки данных)";
        } else if (pathname === "/profile") {
            actionDescription = "Авторизовался и зашел в Личный кабинет пользователя";
        } else if (pathname.startsWith("/admin")) {
            actionDescription = "Администратор зашел в Главную админ-панель";
        }

        // Отправляем лог в PostgreSQL в асинхронном фоновом режиме (не фризит интерфейс PWA)
        trackMutation.mutate({
            action: actionDescription,
            path: pathname,
        });
    }, [pathname, trackMutation]);

    return null; // Компонент работает исключительно в фоне и ничего не рендерит визуально
}
