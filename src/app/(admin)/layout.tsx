import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <section className="mx-auto w-full max-w-5xl px-5 py-8">{children}</section>; }
