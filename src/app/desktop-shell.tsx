"use client";

import { motion } from "framer-motion";
import { Activity, BookOpen, Home, LayoutGrid } from "lucide-react";
import Link from "next/link";

const tabs = [
  { href: "/", label: "Обзор", icon: Home },
  { href: "/services", label: "Услуги", icon: LayoutGrid },
  { href: "/media", label: "Медиа", icon: BookOpen },
  { href: "/api/health", label: "Состояние", icon: Activity },
];

export function DesktopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/95 px-8 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8">
          <Link
            href="/"
            className="text-sm font-black tracking-[0.24em] text-sky-300"
          >
            MIT3
          </Link>
          <nav
            aria-label="Основная навигация"
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1"
          >
            {tabs.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
          <span className="text-xs tracking-[0.12em] text-slate-500">
            T3 / FIELD CONSOLE
          </span>
        </div>
      </header>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="min-h-[calc(100vh-4.5rem)]"
      >
        {children}
      </motion.main>
    </div>
  );
}
