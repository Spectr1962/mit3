export const metadata = { title: "Контакты | MIT3", alternates: { canonical: "/contacts" } };

export default function ContactsPage() {
  return <section className="space-y-6"><p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">Контакты</p><h1 className="text-4xl font-black">Начнём с короткого разговора.</h1><p className="max-w-xl text-lg leading-8 text-slate-300">Напишите, какую задачу нужно решить, и мы соберём следующий практичный шаг.</p><a className="inline-flex rounded-lg bg-sky-400 px-5 py-3 font-bold text-slate-950" href="mailto:hello@mit3.ru">hello@mit3.ru</a></section>;
}
