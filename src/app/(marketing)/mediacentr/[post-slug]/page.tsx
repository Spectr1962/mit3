import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";

interface PageProps {
    params: Promise<{ "post-slug": string }>;
}

async function getPost(slug: string) {
    return db.post.findUnique({
        where: { slug },
        include: { relatedService: { select: { name: true, slug: true } } },
    });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { "post-slug": slug } = await params;
    const post = await getPost(slug);

    if (!post) return { title: "Материал не найден | Медиацентр" };

    return {
        title: `${post.title} | Медиацентр`,
        description: post.leadText,
        openGraph: {
            title: post.title,
            description: post.leadText,
            type: "article",
            publishedTime: post.datePublished.toISOString(),
            modifiedTime: post.dateModified.toISOString(),
            images: post.bannerImage ? [post.bannerImage] : undefined,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { "post-slug": slug } = await params;
    const post = await getPost(slug);

    if (!post) notFound();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
                <Link href="/mediacentr" className="text-sm font-semibold text-sky-300 hover:text-sky-200">← Все материалы</Link>
                <header className="mt-10 border-b border-white/10 pb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{post.topic} · {post.datePublished.toLocaleDateString("ru-RU")}</p>
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{post.title}</h1>
                    <p className="mt-6 text-xl leading-8 text-slate-300">{post.leadText}</p>
                </header>
                <div className="whitespace-pre-wrap py-10 text-lg leading-8 text-slate-200">{post.content}</div>
                {post.relatedService && (
                    <aside className="border-t border-white/10 pt-8">
                        <p className="text-sm text-slate-400">Инструмент из материала</p>
                        <Link href={`/services/${post.relatedService.slug}`} className="mt-2 inline-block text-lg font-bold text-sky-300 hover:text-sky-200">
                            {post.relatedService.name} →
                        </Link>
                    </aside>
                )}
            </article>
        </main>
    );
}
