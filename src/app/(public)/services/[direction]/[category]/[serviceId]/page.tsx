import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "~/server/db";

export async function generateMetadata({ params }: { params: Promise<{ direction: string; category: string; serviceId: string }> }) {
  const { direction, category, serviceId } = await params;
  const service = await db.service.findUnique({ where: { id: serviceId } }).catch(() => null);
  return { title: service ? `${service.name} | MIT3` : "Услуга | MIT3", alternates: { canonical: `/services/${direction}/${category}/${serviceId}` } };
}

export default async function ServicePage({ params }: { params: Promise<{ direction: string; category: string; serviceId: string }> }) {
  const { direction, category, serviceId } = await params;
  const service = await db.service.findFirst({ where: { id: serviceId, category: { slug: category, direction: { slug: direction } } }, include: { category: { include: { direction: true } } } }).catch(() => null);
  if (!service) notFound();
  return <article className="max-w-3xl space-y-7"><nav className="text-sm text-slate-400"><Link href={`/services/${direction}`}>{service.category.direction.name}</Link> / <Link href={`/services/${direction}/${category}`}>{service.category.name}</Link></nav><h1 className="text-5xl font-black">{service.name}</h1><p className="text-xl leading-8 text-slate-300">{service.description}</p></article>;
}
