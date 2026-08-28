import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "~/server/db";

export async function generateMetadata({ params }: { params: Promise<{ direction: string }> }) {
  const { direction: slug } = await params;
  const direction = await db.direction.findUnique({ where: { slug } }).catch(() => null);
  return { title: direction ? `${direction.name} | MIT3` : "Направление | MIT3", alternates: { canonical: `/services/${slug}` } };
}

export default async function DirectionPage({ params }: { params: Promise<{ direction: string }> }) {
  const { direction: slug } = await params;
  const direction = await db.direction.findUnique({ where: { slug }, include: { categories: true } }).catch(() => null);
  if (!direction) notFound();
  return <section className="space-y-8"><nav className="text-sm text-slate-400"><Link href="/services" className="hover:text-white">Услуги</Link> / {direction.name}</nav><h1 className="text-4xl font-black">{direction.name}</h1><div className="grid gap-4 sm:grid-cols-2">{direction.categories.map((category) => <Link key={category.id} href={`/services/${slug}/${category.slug}`} className="rounded-xl border border-white/10 p-5 hover:border-sky-300/60"><h2 className="font-bold">{category.name}</h2></Link>)}</div></section>;
}
