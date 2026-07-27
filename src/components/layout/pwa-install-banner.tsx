"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";

// 1. СТРОГАЯ ТИПИЗАЦИЯ БРАУЗЕРНЫХ СОБЫТИЙ ДЛЯ ЛИНТЕРА
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

interface IosNavigator extends Navigator {
    standalone?: boolean;
}

export function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIos, setIsIos] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Проверяем локальное хранилище, скрывался ли баннер на этой неделе
        const isDismissed = localStorage.getItem("pwa_banner_dismissed");
        if (isDismissed) {
            const dismissTime = parseInt(isDismissed, 10);
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - dismissTime < oneWeek) return;
        }

        // Проверяем, добавлено ли уже PWA в автономный режим (standalone)
        const iosNav = window.navigator as IosNavigator;
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches
            || iosNav.standalone === true;

        if (isStandalone) return;

        // Детектор операционной системы Apple iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isAppleIos = /iphone|ipad|ipod/.test(userAgent);
        setIsIos(isAppleIos);

        // Если это iPhone — сразу активируем баннер с инструкцией
        if (isAppleIos) {
            setIsVisible(true);
            return;
        }

        // Перехват системного события установки для Android
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    // 2. ВСЕ ОБРАБОТЧИКИ НАХОДЯТСЯ СТРОГО ВНУТРИ ТЕЛА КОМПОНЕНТА
    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("pwa_banner_dismissed", Date.now().toString());
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-card/95 backdrop-blur-md border border-primary/20 rounded-2xl p-4 shadow-[0_10px_30px_rgba(var(--primary),0.15)] flex items-start gap-4 relative overflow-hidden">

                {/* Кнопка закрытия */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    aria-label="Закрыть"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Пульсирующая иконка */}
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 mt-1 relative">
                    <Smartphone className="h-5 w-5" />
                    <span className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-40 scale-75" />
                </div>

                {/* Текстовый b2b-контент */}
                <div className="space-y-2 flex-1 pr-4">
                    <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-foreground tracking-tight">
                            Установить MIT3 на экран
                        </h4>

                        {isIos ? (
                            <p className="text-[11px] text-muted-foreground leading-normal">
                                Нажмите снизу кнопку <Share className="h-3.5 w-3.5 inline mx-0.5 text-primary" /> <strong>«Поделиться»</strong>, затем прокрутите меню и выберите <strong>«На экран „Домой“»</strong>.
                            </p>
                        ) : (
                            <p className="text-[11px] text-muted-foreground leading-normal">
                                Добавьте платформу на рабочий стол для моментального доступа к 7 VIP-услугам и работе в офлайн-режиме.
                            </p>
                        )}
                    </div>

                    {/* Кнопка установки для Android платформ */}
                    {!isIos && deferredPrompt && (
                        <button
                            onClick={handleInstallClick}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto justify-center"
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span>Установить в 1 клик</span>
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
