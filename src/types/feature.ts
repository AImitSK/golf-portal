// types/feature.ts
export type FeatureType = 'counter' | 'boolean';

export interface Feature {
    _id: string;
    _type: 'feature';
    name: string;
    key: string;
    typ: FeatureType;
    beschreibung?: string;
}