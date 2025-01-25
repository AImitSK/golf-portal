// types/vertragsmodell.d.ts

export interface FeatureDetails {
    name: string;
    beschreibung: string | null;
    typ: 'boolean' | 'counter';
}

export interface VertragsFeature {
    featureDetails: FeatureDetails;
    limit: number;
}

export interface Vertragsmodell {
    name: string;
    preis: number;
    beschreibung: string;
    isTopPosition: boolean;
    features: VertragsFeature[];
}

export interface SortedFeature {
    id: string;
    name: string;
    beschreibung: string | null;
    typ: 'boolean' | 'counter';
    tiers: Record<string, number>;
    nonZeroCount: number;
}