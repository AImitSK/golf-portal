// types/vertragsmodell.d.ts
export interface FeatureLimitierung {
    hat_limit: boolean;
    limit_wert?: number;
    limit_einheit?: string;
}

export interface FeatureDetails {
    name: string;
    beschreibung: string | null;
    typ: 'boolean' | 'counter';
    icon?: string;
}

export interface VertragsFeature {
    featureDetails: FeatureDetails;
    limitierung?: FeatureLimitierung;
    limit: number;
}

export interface Vertragsmodell {
    name: string;
    preis: number;
    beschreibung: string;
    isTopPosition: boolean;
    features: VertragsFeature[];
    supportLevel?: string;
    stripePriceId?: string;
    bild?: {
        asset?: {
            url?: string; // Die URL ist optional
        };
    };
}