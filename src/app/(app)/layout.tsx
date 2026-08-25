export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Боковое меню или таб-бар вашего PWA-приложения */}
            <div className="flex-1">{children}</div>
        </div>
    );
}
