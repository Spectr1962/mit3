import Link from "next/link";
export const metadata = { title: "Медиа | MIT3", alternates: { canonical: "/media" } };
export default function MediaPage() { return <section className="space-y-6"><p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">Медиацентр</p><h1 className="text-4xl font-black">Материалы для решений.</h1><Link href="/media/articles" className="inline-flex rounded-lg border border-white/20 px-5 py-3 font-bold">Все статьи</Link></section>; }
