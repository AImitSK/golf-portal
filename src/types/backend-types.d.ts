// Import der Icon-Typen z. B. von Heroicons (oder anderen Icon-Komponenten)
import { ComponentType, SVGProps } from "react";

// Typ für Navigator Icons
export type NavigatorIcon = ComponentType<SVGProps<SVGSVGElement>>;

// Subnavigation für Unterpunkte
export interface SubNavigation {
    name: string; // Name des Unterpunkts
    href: string; // URL des Unterpunkts
}

// Haupt-Navigationspunkte
export interface NavigationItem {
    name: string; // Name des Navigationspunkts
    href: string; // URL (falls zutreffend)
    icon: NavigatorIcon; // Icon des Menüpunktes
    current: boolean; // Ist der aktuelle Punkt aktiv
    children?: SubNavigation[]; // Array mit Unterpunkten
}

// Typ für zentrale Navigation
export type NavigationItems = NavigationItem[];