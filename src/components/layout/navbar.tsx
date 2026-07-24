"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Newspaper, Briefcase, User } from "lucide-react";

export function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Услуги", href: "/services", icon: Layers },
        { label: "Кейсы", href: "/cases", icon: Briefcase },
        { label: "Медиа", href: "/media", icon: Newspaper },
        { label: "Кабинет", href: "/profile", icon: User },
    ];

    return (
        // md:hidden скрывает меню на ПК. pb-safe учитывает системную полосу навигации iOS/Android
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-2 backdrop-blur-sm md:hidden pb-safe shadow-lg">
            <div className="flex justify-around items-center h-12">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 text-[10px] font-medium transition-colors ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                                }`}
                        >
                            <Icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110 text-primary" : ""}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
