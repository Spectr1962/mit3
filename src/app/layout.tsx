import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata, type Viewport } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Tracker } from "~/components/utils/tracker";

// 1. НАСТРОЙКА VIEWPORT ДЛЯ НАДЁЖНОГО ОТОБРАЖЕНИЯ НА СМАРТФОНАХ
export const viewport: Viewport = {
  themeColor: "#020617", // Тёмный b2b цвет шапки приложения
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Запрещаем случайный зум экрана пальцами (UX нативного приложения)
  viewportFit: "cover", // Растягиваем интерфейс под «челки» iPhone
};

// 2. РАСШИРЕННЫЕ МЕТАТЕГИ PWA ДЛЯ APPLE И ANDROID
export const metadata: Metadata = {
  title: "MIT3 PWA Platform",
  description: "Многостраничная b2b платформа на T3 стеке",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MIT3 Platform",
  },
  formatDetection: {
    telephone: false, // Отключаем автоподсветку номеров Safari, у нас настроен tel: протокол
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Tracker />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
