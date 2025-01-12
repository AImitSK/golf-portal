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
};

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

// Adresse Typ
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

// Service Typ
export interface Services {
    restaurant?: boolean;
    golfschule?: boolean;
    proShop?: boolean;
    cartVermietung?: boolean;
    leihausruestung?: boolean;
    sanitaeranlagen?: boolean;
    umkleide?: boolean;
}

// Mitgliedschaft Typ
export interface Mitgliedschaft {
    moeglich?: boolean;
    schnuppermitgliedschaft?: boolean;
    aufnahmegebuehr?: boolean;
    warteliste?: boolean;
}

// Turniere Typ
export interface Turniere {
    club?: boolean;
    gaeste?: boolean;
    rangliste?: boolean;
}

// SEO Typ
export interface SEO {
    title?: string;
    description?: string;
}

// Golf Club Typ
export interface GolfClub {
    title: string; // Titel des Golfclubs
    slug: string; // URL-Slug des Clubs
    image?: string; // Optional: Bild-URL des Clubs
    city: string; // Stadt des Clubs
    // Kontaktdaten
    clubWebsite?: string; // Club-Website URL
    clubEmail?: string; // E-Mail-Adresse des Clubs
    clubTelefon?: string; // Telefonnummer des Clubs

    // Adresse des Clubs
    adresse?: Address; // Adresse mit Ort, Straße, Land, PLZ und Geo-Information

    // Platzinformationen
    anzahlLoecher?: number; // Anzahl der Löcher
    parGesamt?: number; // Gesamtes Par des Golfplatzes
    laengeMeter?: number; // Gesamtlänge des Platzes in Metern
    handicapBeschraenkung?: number; // Vorgabenbeschränkung
    courseRating?: number; // Schwierigkeitsbewertung des Platzes
    slope?: number; // Steigungsbewertung
    platztyp?: string; // Typ des Golfplatzes (z. B. Parkland, Links)
    besonderheiten?: string[]; // Besondere Eigenschaften des Platzes

    // Aktuelles Modell des Golfclubs
    aktuellesModell?: {
        name: string; // Name des Modells
        isTopPosition?: boolean; // Ist der Club in einer Top-Position?
        topPositionRank?: number; // Rang der Top-Position
    };

    // Dienstleistungen
    services?: Services; // Dienstleistungen wie Restaurant, Golfschule etc.

    // Mitgliedschaftsinformationen
    mitgliedschaft?: Mitgliedschaft; // Details zu Mitgliedschaften

    // Turniere im Golfclub
    turniere?: Turniere; // Informationen zu Turnieren

    // SEO-Daten
    seo?: SEO; // SEO-Metadaten wie Titel und Beschreibung
}

// Map Component Props Types
export interface MapInteractionProps {
    onMarkerClick?: (location: GeoLocation) => void;
    onKeyPress?: (event: React.KeyboardEvent) => void;
    ariaLabel?: string;
    tabIndex?: number;
}

// Props für die Club-Detailseite
export interface ClubDetailPageProps {
    params: {
        slug: string;
    };
}

// Erweitere club-types.d.ts um:

// Galerie Bild Type
export interface GalleryImage {
    asset: {
        url: string;
    };
    beschreibung?: string | null;
    alt?: string | null;
}

// Props für die Galerie-Komponente
export interface ClubGalleryProps {
    images: GalleryImage[];
}