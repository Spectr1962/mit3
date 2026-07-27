"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

// Строгая типизация нативного браузерного события PWA установки
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 1. Проверяем, не скрывал ли пользователь баннер ранее в рамках этой недели
        const isDismissed = localStorage.getItem("pwa_banner_dismissed");
        if (isDismissed) {
            const dismissTime = parseInt(isDismissed, 10);
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            // Если неделя еще не прошла — баннер не показываем
            if (Date.now() - dismissTime < oneWeek) return;
        }

        // 2. Проверяем, запущено ли приложение уже как PWA (Standalone режим)
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        if (isStandalone) return;

        // 3. Перехватываем нативное событие браузера на готовность к установке
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);
    // Функция вызова нативного диалогового окна установки смартфона
    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Вызываем системное окно установки iOS/Android
        await deferredPrompt.prompt();

        // Ждем выбора пользователя
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            // Если пользователь установил PWA — обнуляем триггер и скрываем баннер
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    // Функция скрытия баннера, если пользователь нажал на крестик
    const handleDismiss = () => {
        setIsVisible(false);
        // Запоминаем таймштамп скрытия, чтобы не беспокоить пользователя целую неделю
        localStorage.setItem("pwa_banner_dismissed", Date.now().toString());
    };

    // Если условий для показа нет — компонент ничего не рендерит
    if (!isVisible || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-card/90 backdrop-blur-md border border-primary/20 rounded-2xl p-4 shadow-[0_10px_30px_rgba(var(--primary),0.15)] flex items-start gap-4 relative overflow-hidden">

                {/* Кнопка закрытия (крестик) */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    aria-label="Закрыть уведомление"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Иконка смартфона с пульсирующим фоном */}
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 mt-1 relative">
                    <Smartphone className="h-5 w-5" />
                    <span className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-40 scale-75" />
                </div>

                {/* Текстовый блок и кнопка действия */}
                <div className="space-y-2 flex-1 pr-4">
                    <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-foreground tracking-tight">
                            Установить MIT3 на экран
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-normal">
                            Добавьте платформу на рабочий стол для моментального доступа к 7 VIP-услугам и работе в офлайн-режиме.
                        </p>
                    </div>

                    <button
                        onClick={handleInstallClick}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span>Установить в 1 клик</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
