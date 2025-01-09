// src/types/club-types.d.ts
export type { GolfClub } from "@/components/clubs/ClubGrid";

// Basistyp für Filterwerte
export type FilterValue = string | number | boolean;

// Spezifische Filter-Typen
export type ClubFilters = {
    searchQuery?: string;
    cityFilter?: string;
    maxHandicap?: number;
}

// Erweiterte Filter für das neue Tag-System
export type TagFilters = Record<string, FilterValue>;

// Kombinierter Filtertyp
export type CombinedFilters = ClubFilters & TagFilters;

// Display-Namen Mapping für Filter
export type FilterDisplayNames = {
    [K in keyof CombinedFilters]?: string;
};