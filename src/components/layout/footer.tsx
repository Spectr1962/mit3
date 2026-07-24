import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30 hidden md:block w-full mt-auto">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0 px-4">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} T3 PWA Platform. Все права защищены.
                </p>
                <div className="flex gap-6 text-xs text-muted-foreground">
                    <Link href="/privacy" className="hover:text-primary transition-colors">Политика обработки данных</Link>
                    <span className="text-muted-foreground/40">|</span>
                    <Link href="/contacts" className="hover:text-primary transition-colors">Контакты компании</Link>
                </div>
            </div>
        </footer>
    );
}
