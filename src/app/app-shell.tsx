"use client";

import { useEffect, useState } from "react";
import { DesktopShell } from "./desktop-shell";
import { MobileShell } from "./mobile-shell";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (isMobile === null) return <div className="min-h-screen bg-[#07111f]" />;
  return isMobile ? (
    <MobileShell isOnline={isOnline}>{children}</MobileShell>
  ) : (
    <DesktopShell>{children}</DesktopShell>
  );
}
