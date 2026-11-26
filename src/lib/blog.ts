import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    tag: string;
    content: string;
}

export function getAllPosts(): BlogPost[] {
    if (!fs.existsSync(postsDirectory)) return [];

    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: (data.title as string) ?? "Без названия",
                date: (data.date as string) ?? "",
                description: (data.description as string) ?? "",
                tag: (data.tag as string) ?? "Статья",
                content,
            };
        });

    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        slug,
        title: (data.title as string) ?? "Без названия",
        date: (data.date as string) ?? "",
        description: (data.description as string) ?? "",
        tag: (data.tag as string) ?? "Статья",
        content,
    };
}
