export default function BlogPostPage({
    params,
}: {
    params: { "post-slug": string };
}) {
    // В вашей версии Next.js params — это обычный готовый объект, никакой асинхронности!
    const slug = params["post-slug"];

    return (
        <main className="container mx-auto px-4 py-16">
            <article className="prose max-w-4xl mx-auto">
                <span className="text-sm text-muted-foreground">Медиацентр / Публикация</span>
                <h1 className="text-4xl font-bold mt-2 mb-6">Динамическая статья из Prisma</h1>
                <p className="text-xl text-muted-foreground">
                    Текущий адрес страницы (слаг): <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{slug}</code>
                </p>
                <div className="mt-8">
                    <p>Контент статьи и разбор PWA-решения будут загружаться из базы данных автоматически по этому слагу.</p>
                </div>
            </article>
        </main>
    );
}
