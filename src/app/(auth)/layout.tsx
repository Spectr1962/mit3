import type { Metadata } from "next";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-md items-center px-5 py-10">{children}</main>;
}
