// src/types/club-types.d.ts

// GeoFilter Typen
export interface GeoFilterValue {
    lat: number;
    lng: number;
    radius: number;
}

// Basistyp für Filterwerte
export type FilterValue = string | number | boolean | GeoFilterValue;

// SEO Type
export interface SEO {
    title?: string;
    description?: string;
    keywords?: string[];
}

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
    hausnummer?: string;
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

// Bild Type
export interface Bild {
    asset?: {
        url: string;
    };
    beschreibung?: string;
    alt?: string;
}

// Golf Club Type
export interface GolfClub {
    title: string;
    slug: string;
    status?: 'draft' | 'published';
    beschreibung?: string;
    image?: string;
    city: string;
    seo?: SEO;
    // Bilder
    logo?: Bild;
    titelbild?: Bild;
    bildergalerie?: Bild[];
    // Kontaktdaten
    clubWebsite?: string;
    clubEmail?: string;
    clubTelefon?: string;
    adresse?: Address;
    // Platz Details
    anzahlLoecher?: number;
    parGesamt?: number;
    laengeMeter?: number;
    handicapBeschraenkung?: number;
    courseRating?: number;
    slope?: number;
    platztyp?: string;
    schwierigkeitsgrad?: 'Anfänger' | 'Fortgeschrittene' | 'Championship';
    besonderheiten?: string[];
    // Einrichtungen
    uebungsanlagen?: string[];
    services?: Services;
    // Club Info
    mitgliedschaft?: Mitgliedschaft;
    turniere?: Turniere;
    // Administration
    aktuellesModell?: {
        name: string;
        isTopPosition?: boolean;
        topPositionRank?: number;
    };
    vertragsBeginn?: string;
    vertragsEnde?: string;
    zahlungsStatus?: 'aktiv' | 'ausstehend' | 'gekündigt';
}