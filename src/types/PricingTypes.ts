// src/types/PricingTypes.ts

export interface Tier {
    name: string;
    description: string;
    priceMonthly: string;
    href: string;
    highlights: { description: string; disabled?: boolean }[];
}

export interface Section {
    name: string;
    features: {
        name: string;
        tiers: Record<string, string | boolean>;
    }[];
}

