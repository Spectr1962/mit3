import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "~/components/Navbar";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "mit3 — Агентство комплексного цифрового маркетинга",
    template: "%s | mit3",
  },
  applicationName: "mit3",
  description:
    "Системное привлечение клиентов и рост выручки: маркетинговая стратегия, SEO, SMM, контент-продакшн и быстрые PWA-сайты под ключ.",
  metadataBase: new URL("https://mit3.ru"),
  openGraph: {
    title: "mit3 — Агентство комплексного цифрового маркетинга",
    description:
      "Комплексное продвижение бизнеса и разработка конверсионных PWA-платформ.",
    url: "https://mit3.ru",
    siteName: "mit3",
    locale: "ru_RU",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${unbounded.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <TRPCReactProvider>
          <div className="flex min-h-screen flex-col pb-16 md:pb-0">
            <Navbar />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
              {children}
            </main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
              <div className="mx-auto max-w-5xl px-4 sm:px-6">
                © 2026 mit3. Агентство комплексного цифрового маркетинга.
              </div>
            </footer>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
