import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const adminLogin = process.env.AUTH_ADMIN_LOGIN;

    if (!session?.user || !adminLogin || session.user.id !== adminLogin) {
        redirect("/login?callbackUrl=/admin");
    }

    return children;
}