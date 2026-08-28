import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

const adminEmail = "larionov.igor1987@yandex.ru";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (session?.user.email !== adminEmail) {
        redirect("/login?callbackUrl=/admin");
    }

    return children;
}