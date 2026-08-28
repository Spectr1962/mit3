export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-5 py-8">{children}</div>;
}
