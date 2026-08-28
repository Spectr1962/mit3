import { signIn } from "~/server/auth";

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { callbackUrl = "/dashboard" } = await searchParams;
  const safeCallbackUrl =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/dashboard";

  async function handleSignIn(formData: FormData) {
    "use server";
    const login = String(formData.get("login") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    await signIn("credentials", {
      login,
      password,
      callbackUrl: safeCallbackUrl,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
          Личный кабинет
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight">
          Войти в рабочее пространство
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Для клиентов и предпринимателей, которые тестируют решение или
          работают с нами постоянно.
        </p>
        <form action={handleSignIn}>
          <label
            htmlFor="login"
            className="mt-6 block text-left text-sm font-semibold text-slate-300"
          >
            Логин
          </label>
          <input
            id="login"
            name="login"
            type="text"
            required
            autoComplete="username"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-sky-400"
          />
          <label
            htmlFor="password"
            className="mt-4 block text-left text-sm font-semibold text-slate-300"
          >
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-sky-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-sky-300"
          >
            Войти
          </button>
        </form>
      </section>
    </main>
  );
}
