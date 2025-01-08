"use client";

import React from "react";
import ClubGrid from "@/components/clubs/ClubGrid";
import { GolfClub } from "@/types/club-types";

// Funktion, um verschachtelte Eigenschaften sicher abzurufen
const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((value, key) => value?.[key], obj);
};

interface FilterableClubGridProps {
    initialClubs: GolfClub[];
    filterCriteria?: Record<string, any>; // Beliebige Filterkriterien, auch für verschachtelte Felder
}

const FilterableClubGrid: React.FC<FilterableClubGridProps> = ({ initialClubs, filterCriteria = {} }) => {
    // Filter Clubs basierend auf den übergebenen Kriterien
    const filteredClubs = initialClubs.filter((club) => {
        return Object.entries(filterCriteria).every(([key, value]) => {
            // Kein Filter gesetzt für dieses Kriterium
            if (value === undefined || value === null) return true;

            const clubValue = getNestedValue(club, key); // Verschachtelten Wert abrufen

            // Prüfe auf `undefined`, falls der Wert im Objekt nicht existiert
            if (clubValue === undefined || clubValue === null) return false;

            // String-Vergleich (inkl. lowercase)
            if (typeof clubValue === "string" && typeof value === "string") {
                return clubValue.toLowerCase().includes(value.toLowerCase());
            }

            // Nummerischer Vergleich
            if (typeof clubValue === "number" && typeof value === "number") {
                return clubValue === value;
            }

            // Boolean-Vergleich
            if (typeof clubValue === "boolean" && typeof value === "boolean") {
                return clubValue === value;
            }

            // Arrays prüfen (z.B. `besonderheiten`)
            if (Array.isArray(clubValue)) {
                return clubValue.includes(value);
            }

            // Keine Übereinstimmung für unbekannten Typ
            return false;
        });
    });

    return (
        <div>
            {/* ClubGrid anzeigen */}
            <ClubGrid clubs={filteredClubs} />
        </div>
    );
};

export default FilterableClubGrid;