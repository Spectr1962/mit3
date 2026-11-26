"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface ServiceOption {
    slug: string;
    title: string;
}

export function ContactForm({ services }: { services: ServiceOption[] }) {
    const searchParams = useSearchParams();
    const initialService = searchParams.get("service") ?? "";

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [serviceSlug, setServiceSlug] = useState(initialService);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (initialService) setServiceSlug(initialService);
    }, [initialService]);

    const createLead = api.lead.create.useMutation({
        onSuccess: () => {
            setName("");
            setContact("");
            setMessage("");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createLead.mutate({ name, contact, serviceSlug, message });
    };

    if (createLead.isSuccess) {
        return (
            <div className="bg-card flex flex-col items-start gap-4 rounded-xl border p-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Заявка успешно отправлена</h3>
                    <p className="text-muted-foreground text-sm">
                        Спасибо за обращение! Мы свяжемся с вами по указанным контактам в
                        ближайшее время.
                    </p>
                </div>
                <Button variant="outline" onClick={() => createLead.reset()}>
                    Отправить еще одну заявку
                </Button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-card space-y-4 rounded-xl border p-6"
        >
            <div className="space-y-2">
                <Label htmlFor="name">Ваше имя *</Label>
                <Input
                    id="name"
                    placeholder="Иван"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact">Телефон, Telegram или Email *</Label>
                <Input
                    id="contact"
                    placeholder="+7 (999) 000-00-00 или @username"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="service">Интересующая услуга</Label>
                <select
                    id="service"
                    value={serviceSlug}
                    onChange={(e) => setServiceSlug(e.target.value)}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                >
                    <option value="">Не выбрана (общий вопрос)</option>
                    {services.map((s) => (
                        <option key={s.slug} value={s.slug}>
                            {s.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Комментарий к задаче</Label>
                <Textarea
                    id="message"
                    placeholder="Кратко опишите вашу задачу..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            {createLead.error && (
                <p className="text-sm text-red-600">{createLead.error.message}</p>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={createLead.isPending}
            >
                {createLead.isPending ? "Отправка..." : "Отправить заявку"}
            </Button>
        </form>
    );
}
