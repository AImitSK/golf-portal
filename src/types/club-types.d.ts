// src/types/club-types.d.ts

// GeoFilter Typen
export interface GeoFilterValue {
    lat: number;
    lng: number;
    radius: number;
}

// Basistyp für Filterwerte
export type FilterValue = string | number | boolean | GeoFilterValue;

// Spezifische Filter-Typen
export type ClubFilters = {
    searchQuery?: string;
    cityFilter?: string;
    maxHandicap?: number;
}

// Erweiterte Filter für das neue Tag-System
export type TagFilters = {
    [key: string]: FilterValue;
    geoFilter?: GeoFilterValue;
};

// Kombinierter Filtertyp
export type CombinedFilters = ClubFilters & TagFilters;

// Display-Namen Mapping für Filter
export type FilterDisplayNames = {
    [K in keyof CombinedFilters]?: string;
};

// Golf Club Type
export interface GolfClub {
    title: string;
    slug: string;
    image?: string;
    city: string;
    // Kontaktdaten
    clubWebsite?: string;
    clubEmail?: string;
    clubTelefon?: string;
    adresse?: {
        location?: {
            lat: number;
            lng: number;
            alt?: number;
        };
    };
    anzahlLoecher?: number;
    parGesamt?: number;
    laengeMeter?: number;
    handicapBeschraenkung?: number;
    courseRating?: number;
    slope?: number;
    platztyp?: string;
    besonderheiten?: string[];
    aktuellesModell?: {
        name: string;
        isTopPosition?: boolean;
        topPositionRank?: number;
    };
    services?: {
        restaurant?: boolean;
        golfschule?: boolean;
        proShop?: boolean;
    };
}