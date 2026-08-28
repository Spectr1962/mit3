import { notFound } from "next/navigation";
import { db } from "~/server/db";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await db.mediaEntry.findFirst({ where: { id, type: "news", published: true } }).catch(() => null);
  return { title: entry ? `${entry.title} | MIT3` : "Новость | MIT3", alternates: { canonical: `/media/news/${id}` } };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await db.mediaEntry.findFirst({ where: { id, type: "news", published: true } }).catch(() => null);
  if (!entry) notFound();
  return <article className="max-w-3xl space-y-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">Новости</p><h1 className="text-5xl font-black">{entry.title}</h1><p className="text-lg leading-8 text-slate-300">{entry.content}</p></article>;
}
