import Link from "next/link";
import { db } from "~/server/db";

export default async function MarketingHomePage() {
    // Запрашиваем 3 последние статьи из Медиацентра для авто-обновления главной страницы
    const latestPosts = await db.post.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
            slug: true,
            title: true,
            leadText: true,
        },
    });

    return (
        <main className="container mx-auto px-4 py-20">
            {/* Первый экран студии */}
            <section className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] mb-6">
                    Создаем <span className="text-sky-600">PWA-хабы</span> <br />
                    для вашего бизнеса
                </h1>
                <p className="text-xl text-muted-foreground">
                    Переводим компании на технологический стек будущего Next.js и ломаем старый рынок медленных сайтов на CMS.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link href="/services" className="bg-sky-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-sky-700 transition">
                        Каталог решений
                    </Link>
                    <Link href="/mediacentr" className="border px-6 py-3 rounded-xl font-medium hover:bg-muted transition">
                        Медиацентр
                    </Link>
                </div>
            </section>

            {/* Локомотив SEO: Свежие новости из Медиацентра */}
            <section className="max-w-5xl mx-auto border-t pt-12">
                <h2 className="text-2xl font-bold mb-6">Последние материалы из Медиацентра</h2>

                {latestPosts.length === 0 ? (
                    <p className="text-muted-foreground italic">Пока нет публикаций. Скоро здесь появятся ежедневные разборы ниш.</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {latestPosts.map((post) => (
                            <article key={post.slug} className="border p-5 rounded-2xl bg-card hover:shadow-md transition">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                    <Link href={`/mediacentr/${post.slug}`} className="hover:text-sky-600 transition">
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.leadText}</p>
                                <Link href={`/mediacentr/${post.slug}`} className="text-sm font-semibold text-sky-600 hover:underline">
                                    Читать разбор →
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
