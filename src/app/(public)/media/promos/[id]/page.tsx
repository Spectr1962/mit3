import { notFound } from "next/navigation";
import { db } from "~/server/db";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const entry = await db.mediaEntry.findFirst({ where: { id, type: "promo", published: true } }).catch(() => null); return { title: entry ? `${entry.title} | MIT3` : "Предложение | MIT3", alternates: { canonical: `/media/promos/${id}` } }; }
export default async function PromoDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const entry = await db.mediaEntry.findFirst({ where: { id, type: "promo", published: true } }).catch(() => null); if (!entry) notFound(); return <article className="max-w-3xl space-y-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">Предложение</p><h1 className="text-5xl font-black">{entry.title}</h1><p className="text-lg leading-8 text-slate-300">{entry.content}</p></article>; }
