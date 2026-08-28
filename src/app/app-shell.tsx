"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, Home, LayoutGrid, WifiOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "~/components/ui/alert";

const tabs = [
  { href: "/", label: "Обзор", icon: Home },
  { href: "/api/health", label: "Состояние", icon: Activity },
  { href: "/manifest.webmanifest", label: "PWA", icon: LayoutGrid },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateNetworkState = () => setIsOnline(navigator.onLine);
    updateNetworkState();
    window.addEventListener("online", updateNetworkState);
    window.addEventListener("offline", updateNetworkState);
    return () => {
      window.removeEventListener("online", updateNetworkState);
      window.removeEventListener("offline", updateNetworkState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/85 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-sm font-black tracking-[0.24em] text-sky-300">MIT3</Link>
          <span className="text-xs text-slate-500">T3 / FIELD CONSOLE</span>
        </div>
      </header>
      <AnimatePresence>
        {!isOnline && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-5xl px-5 pt-4">
            <Alert className="flex items-center gap-3"><WifiOff className="size-4 shrink-0" />Нет соединения. Доступны только сохранённые данные.</Alert>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="pb-28">
        {children}
      </motion.main>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#07111f]/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-5xl grid-cols-3 px-3 py-2">
          {tabs.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
