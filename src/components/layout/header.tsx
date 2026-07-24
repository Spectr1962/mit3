"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
    const pathname = usePathname();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") setDeferredPrompt(null);
    };

    const navItems = [
        { label: "Услуги", href: "/services" },
        { label: "Кейсы", href: "/cases" },
        { label: "Медиацентр", href: "/media" },
        { label: "Контакты", href: "/contacts" },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">

                {/* Логотип */}
                <Link href="/" className="font-bold text-lg md:text-xl tracking-tight hover:opacity-90 transition-opacity">
                    🚀 T3-Platform
                </Link>

                {/* Навигация для компьютеров (hidden md:flex) */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors hover:text-primary ${isActive ? "text-primary font-semibold" : "text-muted-foreground"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                    <Link
                        href="/profile"
                        className="rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Личный кабинет
                    </Link>
                </nav>

                {/* Кнопка установки PWA для мобильных (md:hidden) */}
                <div className="flex md:hidden items-center">
                    {deferredPrompt && (
                        <button
                            onClick={handleInstallClick}
                            className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground animate-pulse"
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span>Установить PWA</span>
                        </button>
                    )}
                </div>

            </div>
        </header>
    );
}
