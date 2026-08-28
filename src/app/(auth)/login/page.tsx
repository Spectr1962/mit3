import { PremiumInput } from "~/components/ui/premium-input";
import { Button } from "~/components/ui/button";
import { NetworkAwareForm } from "~/components/network-aware-form";

export default function LoginPage() {
    return <section className="w-full space-y-6 rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-md"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">Доступ</p><h1 className="mt-2 text-3xl font-black">Войти в workspace</h1></div><NetworkAwareForm className="space-y-4"><PremiumInput label="Email" name="email" type="email" autoComplete="email" required /><PremiumInput label="Пароль" name="password" type="password" autoComplete="current-password" required /><Button type="submit" className="w-full">Войти</Button></NetworkAwareForm></section>;
}
