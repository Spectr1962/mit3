import { notFound } from "next/navigation";
import { db } from "~/server/db"; // Путь к твоей Prisma БД

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: Props) {
    const { slug } = await params;

    // 1. Достаем услугу из базы со всеми модулями, отзывами и FAQ
    const service = await db.service.findUnique({
        where: { slug },
        include: {
            modules: true,
            reviews: true,
            faqItems: true,
        },
    });

    if (!service) notFound();

    // 2. Высчитываем средний рейтинг на основе реальных отзывов из базы
    const totalReviews = service.reviews.length;
    const averageRating = totalReviews > 0
        ? (service.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : "5.0"; // По умолчанию 5 звезд, если отзывов еще нет

    // 3. ФОРМИРУЕМ JSON-LD ДЛЯ ПОИСКОВИКОВ (Звёздочки + Цены)
    const jsonLdProduct = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": service.title,
        "description": service.seoDescription ?? service.title,
        "image": service.ogImage ?? "https://mit3.ru",
        "offers": {
            "@type": "Offer",
            "price": service.priceFrom,
            "priceCurrency": "RUB",
            "availability": "https://schema.org",
            "url": `https://mit3.ru{service.slug}`
        },
        // Выводим агрегированный рейтинг, только если есть отзывы, чтобы пройти валидацию Google
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": averageRating,
            "reviewCount": totalReviews > 0 ? totalReviews : 1,
            "bestRating": "5",
            "worstRating": "1"
        }
    };

    // 4. ФОРМИРУЕМ JSON-LD ДЛЯ БЛОКА ВОПРОСОВ И ОТВЕТОВ (FAQ)
    const jsonLdFaq = service.faqItems.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqItems.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    return (
        <>
            {/* Вшиваем невидимую разметку Schema.org в код страницы для роботов */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
            />
            {jsonLdFaq && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
                />
            )}

            {/* ВИДИМАЯ ВЕРСТКА СТРАНИЦЫ ДЛЯ КЛИЕНТОВ */}
            <main className="mx-auto max-w-4xl px-4 py-12 font-sans">
                <h1 className="text-4xl font-extrabold mb-4">{service.h1 ?? service.title}</h1>
                <p className="text-xl text-green-600 font-bold mb-8">Стоимость: от {service.priceFrom} ₽</p>

                {/* Вывод модулей, кейсов и отзывов на экране... */}
            </main>
        </>
    );
}
