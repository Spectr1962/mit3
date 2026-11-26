import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "~/components/Navbar";

export const metadata: Metadata = {
  title: "Название компании — Услуги и блог",
  description: "Профессиональные услуги, актуальные цены и полезные статьи",
  icons: [{ rel: "icon", url: "/icon-192x192.png" }],
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="bg-background text-foreground flex min-h-screen flex-col pb-16 antialiased md:pb-0">
        <TRPCReactProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
          </main>
          <footer className="text-muted-foreground border-t py-6 text-center text-sm">
            © {new Date().getFullYear()} Мой Бренд. Все права защищены.
          </footer>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
