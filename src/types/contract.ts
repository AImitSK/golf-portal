// types/contract.ts
export interface FeatureLimit {
    feature: {
        _ref: string;
        _type: 'reference';
    };
    limit: number;
}

export interface ContractModel {
    _id: string;
    _type: 'vertragsmodell';
    name: string;
    stripeProductId: string;
    preis?: number;
    waehrung?: string;
    features: FeatureLimit[];
}