"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agree) return;
        setLoading(true);

        // В будущем здесь будет вызов tRPC мутации регистрации
        // Имитируем успешное создание и отправляем на вход
        setTimeout(() => {
            setLoading(false);
            router.push("/login");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
            <div className="w-full max-w-md space-y-6 bg-card border p-6 md:p-8 rounded-3xl shadow-sm">

                <div className="space-y-2 text-center">
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full font-mono">
                        MIT3.REGISTRATION
                    </span>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                        Создание b2b аккаунта
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Зарегистрируйтесь для сквозного контроля и заказа VIP услуг
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Ваше имя</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Иван Иванов"
                                className="w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Рабочий Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ceo@company.com"
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
                                placeholder="Минимум 8 символов"
                                className="w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* ИНТЕГРАЦИЯ ЧЕКБОКСА СОГЛАСИЯ С ПОЛИТИКОЙ ФЗ-152 */}
                    <div className="flex items-start gap-2.5 pt-2">
                        <input
                            type="checkbox"
                            id="privacy-agree"
                            required
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                        />
                        <label htmlFor="privacy-agree" className="text-[11px] text-muted-foreground leading-normal select-none">
                            Я подтверждаю свое согласие с условиями{" "}
                            <Link href="/privacy" target="_blank" className="text-primary underline font-medium hover:opacity-80">
                                Политики конфиденциальности и обработки персональных данных
                            </Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !agree}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 mt-2| "
                    >
                        <span>{loading ? "Создание профиля..." : "Зарегистрироваться"}</span>
                        {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                </form>

                <p className="text-xs text-center text-muted-foreground border-t pt-4">
                    Уже зарегистрированы?{" "}
                    <Link href="/login" className="text-primary font-semibold hover:underline">
                        Войти в аккаунт
                    </Link>
                </p>

            </div>
        </div>
    );
}
