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

// Geo Location Type
export interface GeoLocation {
    lat: number;
    lng: number;
    alt?: number;
}

// Adresse Type
export interface Address {
    ort?: string;
    strasse?: string;
    plz?: string;
    land?: {
        name: string;
        code: string;
    };
    location?: GeoLocation;
}

// Service Type
export interface Services {
    restaurant?: boolean;
    golfschule?: boolean;
    proShop?: boolean;
    cartVermietung?: boolean;
    leihausruestung?: boolean;
    sanitaeranlagen?: boolean;
    umkleide?: boolean;
}

// Mitgliedschaft Type
export interface Mitgliedschaft {
    moeglich?: boolean;
    schnuppermitgliedschaft?: boolean;
    aufnahmegebuehr?: boolean;
    warteliste?: boolean;
}

// Turniere Type
export interface Turniere {
    club?: boolean;
    gaeste?: boolean;
    rangliste?: boolean;
}

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
    adresse?: Address;
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
    services?: Services;
    mitgliedschaft?: Mitgliedschaft;
    turniere?: Turniere;
}

// Map Component Props Types
export interface MapInteractionProps {
    onMarkerClick?: (location: GeoLocation) => void;
    onKeyPress?: (event: React.KeyboardEvent) => void;
    ariaLabel?: string;
    tabIndex?: number;
}