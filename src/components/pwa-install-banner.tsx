"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const checkMobile = () => setIsMobile(mediaQuery.matches);
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    checkMobile();
    mediaQuery.addEventListener("change", checkMobile);
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => {
      mediaQuery.removeEventListener("change", checkMobile);
      window.removeEventListener("beforeinstallprompt", handlePrompt);
    };
  }, []);

  if (!deferredPrompt || !isMobile || isDismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  return (
    <div
      role="dialog"
      aria-label="Установка приложения"
      className="fixed inset-x-4 bottom-24 z-[60] rounded-xl border border-sky-300/30 bg-[#10283b]/95 p-4 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-sky-300/15 p-2 text-sky-200">
          <Download className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold">Установите приложение</h2>
          <p className="mt-1 text-xs text-slate-300">
            Добавьте MIT3 на главный экран для быстрого доступа.
          </p>
        </div>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={() => setIsDismissed(true)}
          className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
      <Button
        type="button"
        onClick={() => void handleInstall()}
        className="mt-3 w-full"
      >
        Установить
      </Button>
    </div>
  );
}
