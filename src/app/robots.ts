import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://mit3.ru";

    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/services", "/cases", "/media", "/contacts", "/privacy"],
            disallow: [
                "/admin",     // Полностью блокируем индексацию админки
                "/admin/*",   // Блокируем любые внутренние страницы логов и пользователей
                "/profile",   // Блокируем Личный кабинет клиента
                "/login",     // Исключаем системные страницы авторизации
                "/register",
                "/*?*"        // Блокируем сканирование динамических GET-фильтров (защита краулингового бюджета)
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`, // Явно указываем поисковикам путь к нашей динамической карте
    };
}
