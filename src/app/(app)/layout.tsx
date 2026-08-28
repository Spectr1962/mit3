import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard");
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Боковое меню или таб-бар вашего PWA-приложения */}
            <div className="flex-1">{children}</div>
        </div>
    );
}
