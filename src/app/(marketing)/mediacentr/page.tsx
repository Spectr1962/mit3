import Link from "next/link";
import { db } from "~/server/db";

const topics = [
    { value: "all", label: "Все материалы" },
    { value: "trends", label: "Тренды" },
    { value: "cases", label: "Кейсы" },
    { value: "automation", label: "Автоматизация" },
];

interface PageProps {
    searchParams: Promise<{ topic?: string }>;
}

export const metadata = {
    title: "Медиацентр | Стратегия, PWA, SEO и цифровой маркетинг",
    description:
        "Новости, кейсы и практические разборы о цифровом маркетинге, PWA-разработке, SEO и управлении репутацией.",
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export default async function MediacentrPage({ searchParams }: PageProps) {
    const { topic = "all" } = await searchParams;
    const selectedTopic = topics.some((item) => item.value === topic) ? topic : "all";

    const posts = await db.post.findMany({
        where: selectedTopic === "all" ? undefined : { topic: selectedTopic },
        orderBy: { datePublished: "desc" },
        include: {
            relatedService: { select: { name: true, slug: true } },
        },
    });

    const [featuredPost, ...otherPosts] = posts;

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.22),_transparent_38%),linear-gradient(135deg,_#0f172a,_#111827)]">
                <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
                    <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Медиацентр</p>
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Идеи, которые двигают бизнес в цифре</h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                            Практические разборы цифрового маркетинга, разработки PWA, SEO и репутации. Материалы, которые помогают принимать сильные решения.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
                <nav aria-label="Рубрики медиацентра" className="flex flex-wrap gap-3 border-b border-white/10 pb-8">
                    {topics.map((item) => (
                        <Link
                            key={item.value}
                            href={item.value === "all" ? "/mediacentr" : `/mediacentr?topic=${item.value}`}
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                                selectedTopic === item.value
                                    ? "border-sky-400 bg-sky-400 text-slate-950"
                                    : "border-white/15 text-slate-300 hover:border-sky-300 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {featuredPost ? (
                    <>
                        <section className="grid gap-8 border-b border-white/10 py-12 lg:grid-cols-[1.25fr_0.75fr] lg:py-16">
                            <div className="flex min-h-[330px] flex-col justify-end rounded-2xl bg-sky-400 p-7 text-slate-950 sm:p-10">
                                <span className="mb-auto text-sm font-bold uppercase tracking-[0.18em]">Свежий материал</span>
                                <div>
                                    <p className="mb-3 text-sm font-medium opacity-70">{formatDate(featuredPost.datePublished)}</p>
                                    <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{featuredPost.title}</h2>
                                    <p className="mt-5 max-w-2xl text-base leading-7 opacity-80">{featuredPost.leadText}</p>
                                    <Link href={`/mediacentr/${featuredPost.slug}`} className="mt-7 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                                        Читать материал <span aria-hidden="true" className="ml-2">→</span>
                                    </Link>
                                </div>
                            </div>
                            <aside className="flex flex-col justify-center border-l border-white/10 px-1 lg:pl-10">
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">О медиацентре</p>
                                <p className="mt-5 text-2xl font-semibold leading-tight text-white">Здесь стратегия встречается с реальными задачами бизнеса.</p>
                                <Link href="/services" className="mt-8 text-sm font-bold text-sky-300 hover:text-sky-200">Посмотреть услуги <span aria-hidden="true">→</span></Link>
                            </aside>
                        </section>

                        {otherPosts.length > 0 && (
                            <section className="py-12 lg:py-16">
                                <div className="mb-7 flex items-end justify-between gap-4">
                                    <h2 className="text-2xl font-bold sm:text-3xl">Все материалы</h2>
                                    <span className="text-sm text-slate-400">{posts.length} публикаций</span>
                                </div>
                                <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                                    {otherPosts.map((post) => (
                                        <article key={post.id} className="group border-t border-white/15 pt-5">
                                            <p className="text-sm text-slate-400">{formatDate(post.datePublished)}{post.relatedService ? ` · ${post.relatedService.name}` : ""}</p>
                                            <h3 className="mt-3 text-xl font-bold leading-tight text-white group-hover:text-sky-300"><Link href={`/mediacentr/${post.slug}`}>{post.title}</Link></h3>
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{post.leadText}</p>
                                            <Link href={`/mediacentr/${post.slug}`} className="mt-5 inline-block text-sm font-bold text-sky-300">Читать <span aria-hidden="true">→</span></Link>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <section className="border-t border-white/10 py-20">
                        <h2 className="text-2xl font-bold">В этой рубрике пока нет материалов</h2>
                        <p className="mt-3 max-w-xl text-slate-400">Новые разборы, кейсы и наблюдения скоро появятся здесь.</p>
                    </section>
                )}
            </div>
        </main>
    );
}
