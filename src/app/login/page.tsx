import { signIn } from "~/server/auth";

interface PageProps {
    searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
    const { callbackUrl = "/dashboard" } = await searchParams;
    const safeCallbackUrl = callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/dashboard";

    async function handleSignIn(formData: FormData) {
        "use server";
        const email = String(formData.get("email") ?? "").trim().toLowerCase();
        if (email !== "larionov.igor1987@yandex.ru") {
            return;
        }
        await signIn("email", { email, callbackUrl: safeCallbackUrl });
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-slate-100">
            <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Личный кабинет</p>
                <h1 className="mt-4 text-3xl font-black tracking-tight">Войти в рабочее пространство</h1>
                <p className="mt-4 text-sm leading-6 text-slate-400">Для клиентов и предпринимателей, которые тестируют решение или работают с нами постоянно.</p>
                <form action={handleSignIn}>
                    <label htmlFor="email" className="mt-6 block text-left text-sm font-semibold text-slate-300">Email</label>
                    <input id="email" name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-sky-400" placeholder="you@example.com" />
                    <button type="submit" className="mt-4 w-full rounded-xl bg-sky-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-sky-300">
                        Получить ссылку для входа
                    </button>
                </form>
            </section>
        </main>
    );
}