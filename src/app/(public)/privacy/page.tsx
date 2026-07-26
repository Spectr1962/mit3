import Link from "next/link";
import { ShieldCheck, ArrowLeft, Home, ChevronRight } from "lucide-react";

export const metadata = {
    title: "Политика конфиденциальности (ФЗ-152) | MIT3-Platform",
    description: "Официальный документ, регламентирующий правила обработки и защиты персональных данных пользователей.",
};

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 py-4 md:py-8 px-2 md:px-4">

            {/* ХЛЕБНЫЕ КРОШКИ */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/40 p-2.5 px-4 backdrop-blur-sm rounded-xl border w-fit">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    <span>Главная</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                <span className="text-foreground font-semibold">Политика ФЗ-152</span>
            </nav>

            {/* ЗАГОЛОВОК ДОКУМЕНТА */}
            <div className="space-y-4 border-b pb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary w-fit">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
                    Политика обработки персональных данных
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                    Редакция от: 26 июля 2026 года | Соответствует требованиям ФЗ-152 РФ
                </p>
            </div>

            {/* ТЕКСТ ПОЛИТИКИ КИНФИДЕНЦИАЛЬНОСТИ */}
            <article className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-xs md:text-sm leading-relaxed space-y-6">

                <div className="space-y-2">
                    <h2 className="text-sm md:text-base font-bold text-foreground">1. Общие положения</h2>
                    <p>
                        Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006. №152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые Администрацией платформы MIT3 (далее — Оператор).
                    </p>
                    <p>
                        Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.
                    </p>
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm md:text-base font-bold text-foreground">2. Основные понятия, используемые в Политике</h2>
                    <p>
                        Автоматизированная обработка персональных данных — обработка персональных данных с помощью средств вычислительной техники. Информационная система персональных данных — совокупность содержащихся в базах данных персональных данных и обеспечивающих их обработку информационных технологий и технических средств.
                    </p>
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm md:text-base font-bold text-foreground">3. Какие данные пользователя мы обрабатываем</h2>
                    <p>
                        При заполнении b2b-форм захвата лидов, форм обратной связи, регистрации аккаунта и сквозного трекинга активности PWA-интерфейса, Оператор может собирать следующие данные:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Фамилия, имя, отчество пользователя;</li>
                        <li>Электронный почтовый адрес (Email);</li>
                        <li>Контактный номер телефона;</li>
                        <li>Название компании / юридического лица;</li>
                        <li>Технические логи переходов по URL-маршрутам сайта (данные трекера активности).</li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm md:text-base font-bold text-foreground">4. Цели обработки персональных данных</h2>
                    <p>
                        Цель обработки персональных данных Пользователя — предоставление доступа к Личному кабинету, аналитическим дашбордам, информирование Пользователя посредством отправки электронных писем; предоставление доступа к 7 VIP-модулям экосистемы, кейсам и услугам.
                    </p>
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm md:text-base font-bold text-foreground">5. Заключительные положения</h2>
                    <p>
                        Пользователь может получить любые разъяснения по интересующим вопросам, касающимся обработки его персональных данных, обратившись к Оператору с помощью электронной почты <a href="mailto:info@mit3.ru" className="text-primary underline">info@mit3.ru</a>.
                    </p>
                </div>

            </article>

            {/* КНОПКА ВОЗВРАТА */}
            <div className="pt-4 border-t flex justify-center md:justify-start">
                <Link href="/" className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Вернуться на главную страницу</span>
                </Link>
            </div>

        </div>
    );
}
