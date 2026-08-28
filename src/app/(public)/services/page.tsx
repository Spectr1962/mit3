import Link from "next/link";
import { db } from "~/server/db";

export const metadata = { title: "Услуги | MIT3", alternates: { canonical: "/services" } };

export default async function ServicesPage() {
  const directions = await db.direction.findMany({ orderBy: { name: "asc" } }).catch(() => []);
  return <section className="space-y-8"><div><p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">Услуги</p><h1 className="mt-3 text-4xl font-black">Выберите направление.</h1></div><div className="grid gap-4 sm:grid-cols-2">{directions.length ? directions.map((direction) => <Link key={direction.id} href={`/services/${direction.slug}`} className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/60"><h2 className="font-bold">{direction.name}</h2><p className="mt-2 text-sm text-slate-400">Открыть категории направления</p></Link>) : <p className="text-slate-400">Направления появятся после подключения данных.</p>}</div></section>;
}
