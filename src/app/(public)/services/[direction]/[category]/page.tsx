import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "~/server/db";

export default async function CategoryPage({ params }: { params: Promise<{ direction: string; category: string }> }) {
  const { direction, category } = await params;
  const result = await db.category.findFirst({ where: { slug: category, direction: { slug: direction } }, include: { direction: true, services: true } }).catch(() => null);
  if (!result) notFound();
  return <section className="space-y-8"><nav className="text-sm text-slate-400"><Link href="/services">Услуги</Link> / <Link href={`/services/${direction}`}>{result.direction.name}</Link> / {result.name}</nav><h1 className="text-4xl font-black">{result.name}</h1><div className="grid gap-4">{result.services.map((service) => <Link key={service.id} href={`/services/${direction}/${category}/${service.id}`} className="rounded-xl border border-white/10 p-5 hover:border-sky-300/60"><h2 className="font-bold">{service.name}</h2><p className="mt-2 text-sm text-slate-400">{service.description}</p></Link>)}</div></section>;
}
