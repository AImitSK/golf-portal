// src/types/ClubComponentTypes.ts
import type { GolfClub, FilterValue } from '@/types/club-types';

/**
 * Farbschemata für Komponenten
 */
export type ColorScheme = 'dark-green' | 'cta-green' | 'light-green';

/**
 * Erlaubte Werte für Tags
 */
export type TagValue = string | number;

/**
 * Konfiguration für Farbschemata
 */
export interface ColorConfig {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}

/**
 * Vordefinierte Farbkonfigurationen
 */
export const colorConfigs: Record<ColorScheme, ColorConfig> = {
    'dark-green': {
        background: 'bg-cta-green-15',
        text: 'text-dark-green',
        hoverBackground: 'hover:bg-dark-green',
        hoverText: 'hover:text-white'
    },
    'cta-green': {
        background: 'bg-cta-green-15',
        text: 'text-cta-green',
        hoverBackground: 'hover:bg-cta-green',
        hoverText: 'hover:text-white'
    },
    'light-green': {
        background: 'bg-light-green',
        text: 'text-dark-green',
        hoverBackground: 'hover:bg-light-green-dark',
        hoverText: 'hover:text-dark-green'
    }
};

/**
 * Basis Props für Tag-Komponenten
 */
export interface BaseTagProps {
    fieldName: string;
    colorScheme: ColorScheme;
    prefix?: string;
    suffix?: string;
    onClick: (fieldName: string, value: FilterValue) => void;
}

/**
 * Props für einzelne Tag-Komponente
 */
export interface ClubTagProps extends BaseTagProps {
    value: TagValue;
}

/**
 * Props für Tag-Array Komponente
 */
export interface ClubTagArrayProps extends BaseTagProps {
    values: string[];
}

/**
 * Props für Location Button
 */
export interface LocationButtonProps {
    city: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    colorScheme: 'dark-green';
    onClick: (fieldName: string, value: FilterValue) => void;
}

/**
 * Sanity Image Asset Struktur
 */
export interface SanityImageAsset {
    _type: 'image';
    asset: {
        _ref: string;
        _type: 'reference';
    };
    hotspot?: {
        x: number;
        y: number;
        height: number;
        width: number;
    };
    crop?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}

/**
 * Props für Club Image Komponente
 */
export interface ClubImageProps {
    src?: string | SanityImageAsset;
    alt: string;
    className?: string;
    priority?: boolean;
    onError?: () => void;
}

/**
 * Props für Haupt-ClubCard Komponente
 */
export interface ClubCardProps {
    club: GolfClub;
    layout: 'large' | 'compact';
    onTagClick: (fieldName: string, value: FilterValue) => void;
}

/**
 * Props für Club Card Image Komponente
 */
export interface ClubCardImageProps {
    slug: string;
    image?: string;
    title: string;
    isLarge?: boolean;
}

/**
 * Props für Club Actions Komponente
 */
export interface ClubActionsProps {
    clubId: string;
    className?: string;
}

/**
 * Props für Club Tag Section Komponente
 */
export interface ClubTagSectionProps {
    club: GolfClub;
    colorScheme: ColorScheme;
    onTagClick: (fieldName: string, value: FilterValue) => void;
}

/**
 * Props für Club Grid Komponente
 */
export interface ClubGridProps {
    clubs: GolfClub[];
    onTagClick: (fieldName: string, value: FilterValue) => void;
}

/**
 * Status Interface für Club Card
 */
export interface ClubCardState {
    isImageLoaded: boolean;
    hasImageError: boolean;
}

/**
 * Erweiterte Props für Club Image mit Loading Callbacks
 */
export interface ClubImageProps {
    src?: string | SanityImageAsset;
    alt: string;
    className?: string;
    priority?: boolean;
    onError?: () => void;
    onLoadingComplete?: () => void;
}

/**
 * Loading State Interface
 */
export interface LoadingState {
    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;
}

/**
 * Props für Loading Components
 */
export interface LoadingProps {
    className?: string;
    size?: 'small' | 'medium' | 'large';
}

