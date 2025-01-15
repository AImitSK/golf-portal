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

// Galerie Bild Type
export interface GalleryImage {
    asset: {
        url: string;
    };
    beschreibung?: string | null;
    alt?: string | null;
}

// Erweiterung der Kooperation-Schnittstelle
export interface Kooperation {
    _id: string; // ID der Kooperation
    name: string; // Name der Kooperation
    details: string; // Beschreibung der Kooperation
    logo?: string; // Logo-URL der Kooperation (optional)
    slug: string; // Slug für Verlinkungen zur Detailseite
    beschreibung?: string; // Detaillierte Beschreibung (optional)
    typ?: string; // Typ der Kooperation, falls erforderlich
    website?: string; // Optionale Website
    gueltigkeitszeitraum?: string; // Optional: Zeitraum der Gültigkeit
    ansprechpartner?: string; // Optional: Ansprechpartner
    kontaktEmail?: string; // Optional: Kontakt-Email-Adresse
}

// Golf Club Typ
export interface GolfClub {
    title: string; // Titel des Golfclubs
    slug: string; // URL-Slug des Clubs
    image?: string; // Optional: Bild-URL des Clubs
    city: string; // Stadt des Clubs

    // Kooperationen
    kooperationen?: Kooperation[]; // Liste der Kooperationen

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
    schwierigkeitsgrad?: string; // Schwierigkeitsgrad

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

    // Galerie-Bilder
    galerie?: GalleryImage[]; // Optional: Bildergalerie des Golfclubs

    // Kontaktinformationen
    clubTelefon?: string; // Telefonnummer des Clubs
    clubEmail?: string; // E-Mail-Adresse des Clubs
    clubWebsite?: string; // Website-URL des Clubs

}

// Map Component Props Types
export interface MapInteractionProps {
    onMarkerClick?: (location: GeoLocation) => void;
    onKeyPress?: (event: React.KeyboardEvent) => void;
    ariaLabel?: string;
    tabIndex?: number;
}

// Props für die Galerie-Komponente
export interface ClubGalleryProps {
    images: GalleryImage[];
}

// Props für die Club-Detailseite
export interface ClubDetailPageProps {
    params: {
        slug: string;
    };
}

// Typen für Suchergebnisse
export interface SearchClub extends GolfClub {
    _id: string;
}

export interface SearchKooperation {
    _id: string;
    name: string;
    slug: string;
    typ: string;
}

export type SearchResult = {
    id: string;
    title: string;
    type: 'club' | 'kooperation';
    slug: string;
    subtitle?: string;
};