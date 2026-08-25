// Строгий тип для тарифа
export interface TariffItem {
    name: string;
    price: number;
    features: string[];
}

// Строгий тип для FAQ
export interface FaqItem {
    q: string;
    a: string;
}
