import { Suspense } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { api } from "~/trpc/server";
import { ContactForm } from "~/components/ContactForm";
import { Breadcrumbs } from "~/components/shared/Breadcrumbs";

export default async function ContactsPage() {
    const services = await api.service.getAll();

    return (
        <div className="space-y-8">
            <Breadcrumbs items={[{ label: "Контакты" }]} />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Контакты</h1>
                <p className="text-muted-foreground mt-2">
                    Свяжитесь с нами удобным способом или оставьте заявку онлайн
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Левая колонка — контактные данные */}
                <div className="space-y-6">
                    <div className="bg-card space-y-4 rounded-xl border p-6">
                        <h2 className="text-lg font-semibold">Прямая связь</h2>

                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="text-primary h-4 w-4 shrink-0" />
                            <a href="tel:+79000000000" className="hover:underline">
                                +7 (900) 000-00-00
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Send className="text-primary h-4 w-4 shrink-0" />
                            <a
                                href="https://t.me"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline"
                            >
                                Telegram: @username
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="text-primary h-4 w-4 shrink-0" />
                            <a href="mailto:hello@example.ru" className="hover:underline">
                                hello@example.ru
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="text-primary h-4 w-4 shrink-0" />
                            <span>Москва, работаем онлайн по всему миру</span>
                        </div>
                    </div>
                </div>

                {/* Правая колонка — форма заявки */}
                <div>
                    <Suspense fallback={<div>Загрузка формы...</div>}>
                        <ContactForm
                            services={services.map((s) => ({
                                slug: s.slug,
                                title: s.title,
                            }))}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
