import Link from "next/link";
import { getAllPosts } from "~/lib/blog";
import { Badge } from "~/components/ui/badge";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Breadcrumbs } from "~/components/shared/Breadcrumbs";

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: "Блог" }]} />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Блог</h1>
                <p className="text-muted-foreground mt-2">
                    Полезные статьи, кейсы и разборы решений
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                        <Card className="hover:border-primary h-full transition-colors">
                            <CardHeader>
                                <div className="flex items-center justify-between gap-2">
                                    <Badge variant="secondary">{post.tag}</Badge>
                                    <span className="text-muted-foreground text-xs">
                                        {post.date}
                                    </span>
                                </div>
                                <CardTitle className="pt-2 text-xl">{post.title}</CardTitle>
                                <CardDescription>{post.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
