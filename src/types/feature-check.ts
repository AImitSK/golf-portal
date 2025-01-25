// types/feature-check.ts
export interface FeatureAccess {
    allowed: boolean;
    limit?: number;
    current?: number;
}

export interface FeatureCheckHook {
    isAllowed: boolean;
    limit: number;
    current: number;
    isLoading: boolean;
    error?: Error;
}