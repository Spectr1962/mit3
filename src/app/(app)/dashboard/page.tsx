import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard");
    }

    return (
        <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Личный кабинет</p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight">Добро пожаловать{session.user.name ? `, ${session.user.name}` : ""}</h1>
                        <p className="mt-3 text-slate-400">Здесь будут собраны ваши проекты, брифы, задачи и документы.</p>
                    </div>
                    <span className="text-sm text-slate-400">{session.user.email}</span>
                </header>

                <section className="grid gap-5 py-10 md:grid-cols-3">
                    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-sm text-slate-400">Проекты</p>
                        <p className="mt-4 text-3xl font-black">0</p>
                        <p className="mt-2 text-sm text-slate-500">Активные рабочие пространства</p>
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-sm text-slate-400">Брифы</p>
                        <p className="mt-4 text-3xl font-black">0</p>
                        <p className="mt-2 text-sm text-slate-500">Ожидают заполнения</p>
                    </article>
                    <article className="rounded-2xl border border-sky-400/30 bg-sky-400 p-6 text-slate-950">
                        <p className="text-sm font-semibold opacity-70">Следующий шаг</p>
                        <p className="mt-4 text-xl font-black">Заполнить бриф проекта</p>
                        <p className="mt-2 text-sm opacity-70">Расскажите о задаче, чтобы начать работу.</p>
                    </article>
                </section>
            </div>
        </main>
    );
}
