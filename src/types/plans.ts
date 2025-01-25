// src/types/plans.ts
export type PlanFeatures = {
    maxImages: number;
    maxTournaments: number;
    maxMembers: number;
    hasApiAccess: boolean;
    hasPrioritySupport: boolean;
}

export const planFeatures: Record<'Starter' | 'Growth' | 'Scale', PlanFeatures> = {
    Starter: {
        maxImages: 5,
        maxTournaments: 3,
        maxMembers: 100,
        hasApiAccess: false,
        hasPrioritySupport: false
    },
    Growth: {
        maxImages: 20,
        maxTournaments: 10,
        maxMembers: 500,
        hasApiAccess: false,
        hasPrioritySupport: true
    },
    Scale: {
        maxImages: -1, // unbegrenzt
        maxTournaments: -1,
        maxMembers: -1,
        hasApiAccess: true,
        hasPrioritySupport: true
    }
};