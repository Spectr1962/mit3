import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug } from "~/lib/blog";
import { Badge } from "~/components/ui/badge";

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) notFound();

    return (
        <article className="space-y-8">
            <div>
                <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Назад ко всем статьям
                </Link>
            </div>

            <header className="space-y-4 border-b pb-8">
                <div className="flex items-center gap-3">
                    <Badge>{post.tag}</Badge>
                    <span className="text-muted-foreground text-sm">{post.date}</span>
                </div>
                <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                    {post.title}
                </h1>
                <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
                    {post.description}
                </p>
            </header>

            <div className="prose prose-slate max-w-3xl">
                <Markdown>{post.content}</Markdown>
            </div>
        </article>
    );
}
