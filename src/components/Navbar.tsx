"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Tag, BookOpen, Phone } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { InstallPWA } from "~/components/InstallPWA";

const navItems = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/services", label: "Услуги", icon: Briefcase },
    { href: "/pricing", label: "Цены", icon: Tag },
    { href: "/blog", label: "Блог", icon: BookOpen },
    { href: "/contacts", label: "Контакты", icon: Phone },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <>
            {/* Верхняя шапка для компьютеров и мобильных устройств */}
            <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <Link href="/" className="flex shrink-0 items-center">
                        <img
                            src="/logo.png"
                            alt="MIT3"
                            className="h-7 w-auto object-contain sm:h-8"
                        />
                    </Link>

                    {/* Навигация для десктопа */}
                    <nav className="hidden gap-6 md:flex">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors ${isActive
                                        ? "text-primary font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Кнопка установки PWA и кнопка перехода к заявке */}
                    <div className="flex items-center gap-2">
                        <InstallPWA />
                        <Link href="/contacts" className={buttonVariants({ size: "sm" })}>
                            Оставить заявку
                        </Link>
                    </div>
                </div>
            </header>

            {/* Нижнее мобильное меню с иконками (стиль нативного PWA) */}
            <nav className="bg-background fixed right-0 bottom-0 left-0 z-40 flex justify-around border-t py-2 md:hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-2 py-1 text-[11px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
