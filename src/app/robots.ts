import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/', // Скрываем личный кабинет клиента
                '/admin/',     // Скрываем админ-панель
                '/api/',       // Закрываем технические эндпоинты tRPC и API
                '/login',      // Исключаем страницу авторизации
                '/*?*',        // Запрещаем индексацию ссылок с GET-параметрами (защита от дублей при фильтрации)
            ],
        },
        // Указываем точный абсолютный адрес к динамической карте сайта
        sitemap: 'https://site.ru',
    };
}
