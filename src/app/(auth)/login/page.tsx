"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Lock, Mail, ShieldAlert } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Вызываем стандартный метод авторизации NextAuth по стратегии Credentials
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false, // Отключаем автоматический редирект, чтобы обработать ошибку вручную
            });

            if (res?.error) {
                setError("Неверный email или пароль");
            } else {
                router.refresh();
                router.push("/profile"); // При успешном входе отправляем в ЛК
            }
        } catch {
            setError("Произошла системная ошибка при входе");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
            <div className="w-full max-w-md space-y-6 bg-card border p-6 md:p-8 rounded-3xl shadow-sm">

                {/* Заголовок формы */}
                <div className="space-y-2 text-center">
                    <Link href="/" className="font-black text-xl tracking-tight block text-primary">
                        🚀 MIT3.Platform
                    </Link>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                        Вход в систему контроля
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Введите учетные данные для доступа к ЛК и аналитике
                    </p>
                </div>

                {/* Вывод ошибки */}
                {error && (
                    <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-xs flex items-center gap-2 font-medium animate-headShake">
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Email адрес</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Пароль</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <span>{loading ? "Проверка..." : "Войти в кабинет"}</span>
                        {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                </form>

                {/* Ссылка на регистрацию */}
                <p className="text-xs text-center text-muted-foreground border-t pt-4">
                    Ещё нет b2b аккаунта?{" "}
                    <Link href="/register" className="text-primary font-semibold hover:underline">
                        Создать учетную запись
                    </Link>
                </p>

            </div>
        </div>
    );
}
