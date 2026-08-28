import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="max-w-md space-y-5 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">MIT3 / offline</p>
        <h1 className="text-4xl font-black tracking-tight">Связь временно недоступна.</h1>
        <p className="text-slate-400">Сохранённая оболочка приложения доступна. Вернитесь назад или повторите попытку, когда сеть восстановится.</p>
        <Link href="/" className="inline-flex h-11 items-center rounded-lg bg-sky-400 px-5 text-sm font-bold text-slate-950">На главную</Link>
      </section>
    </main>
  );
}
