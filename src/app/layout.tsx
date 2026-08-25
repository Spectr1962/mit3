import "~/styles/globals.css";

import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Цифровые PWA-хабы и решения для бизнеса",
  description: "Проектирование и разработка высокотехнологичных PWA-платформ нового поколения вместо устаревших CMS.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  // Строку manifest отсюда убираем! Next.js сам подключит её из файла app/manifest.ts
};

// Исправляем пустой класс Geist, чтобы Tailwind-переменные работали корректно
const geist = {
  variable: "--font-geist-sans",
  className: "font-sans antialiased"
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={geist.variable} suppressHydrationWarning>
      <body className={geist.className}>
        <SessionProvider>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
