import { db } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Users, Shield, Clock, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminUsersPage() {
    const session = await getServerAuthSession();
    if (session?.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { logs: true },
            },
        },
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto py-2">
            <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                        <Users className="h-7 w-7 text-primary" /> База пользователей платформы
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground">
                        Просмотр зарегистрированных b2b-клиентов и аудит их активности.
                    </p>
                </div>
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border p-2 rounded-xl bg-card">
                    <ArrowLeft className="h-3.5 w-3.5" /> В аналитику
                </Link>
            </div>

            <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                        <thead>
                            <tr className="bg-muted/40 border-b text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                                <th className="p-4">Имя пользователя</th>
                                <th className="p-4">Email / Контакт</th>
                                <th className="p-4">Системная Роль</th>
                                <th className="p-4">Всего логов</th>
                                <th className="p-4 text-right">Дата создания</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => {
                                const userName = user?.name ?? "📱 Анонимный гость";
                                const userEmail = user?.email ?? "";
                                const userRole = user?.role ?? "USER";
                                const logCount = user?._count?.logs ?? 0;
                                const formattedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ru-RU") : "";

                                return (
                                    <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="p-4 font-bold text-foreground">👤 {userName}</td>
                                        <td className="p-4 text-muted-foreground font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 text-primary/60" /> {userEmail}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black font-mono border ${userRole === "ADMIN"
                                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                }`}>
                                                <Shield className="h-3 w-3" /> {userRole}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-foreground/80">📊 {logCount} действий</td>
                                        <td className="p-4 text-right text-muted-foreground font-mono text-xs">
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {formattedDate}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
