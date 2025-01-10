import React from 'react';
import { X } from 'lucide-react';
import { FilterValue, TagFilters, FilterDisplayNames } from '@/types/club-types';

interface ActiveFiltersProps {
    filters: TagFilters;
    onRemoveFilter: (fieldName: string) => void;
    onResetAll: () => void;
}

const displayNames: FilterDisplayNames = {
    anzahlLoecher: 'Löcher',
    parGesamt: 'Par',
    laengeMeter: 'Länge',
    handicapBeschraenkung: 'Handicap',
    courseRating: 'Course Rating',
    slope: 'Slope',
    platztyp: 'Platztyp',
    besonderheiten: 'Besonderheit',
    geoFilter: 'Umkreis',
    'services.restaurant': 'Restaurant',
    'services.golfschule': 'Golfschule',
    'services.proShop': 'Pro Shop'
};

const formatFilterValue = (fieldName: string, value: FilterValue): string => {
    // Spezielle Formatierung für den Geo-Filter
    if (fieldName === 'geoFilter' && typeof value === 'object') {
        const geoValue = value as { lat: number; lng: number; radius: number };
        return `${geoValue.radius}km Umkreis`;
    }

    // Bestehende Formatierungen
    if (fieldName === 'laengeMeter') return `${value}m`;
    if (fieldName === 'handicapBeschraenkung') return `HCP ${value}`;
    if (fieldName === 'courseRating') return `CR ${value}`;
    if (fieldName === 'anzahlLoecher') return `${value} Loch`;
    if (fieldName === 'parGesamt') return `Par ${value}`;
    return String(value);
};

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
                                                                filters,
                                                                onRemoveFilter,
                                                                onResetAll
                                                            }) => {
    if (Object.keys(filters).length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-4 flex-wrap">
                {Object.entries(filters).map(([fieldName, value]) => (
                    <button
                        key={fieldName}
                        onClick={() => onRemoveFilter(fieldName)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-dark-green text-white rounded-full
                                 text-sm font-medium hover:bg-dark-green-dark transition-colors group"
                    >
                        <span>
                            {displayNames[fieldName] || fieldName}: {formatFilterValue(fieldName, value)}
                        </span>
                        <X size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}

                {Object.keys(filters).length > 1 && (
                    <button
                        onClick={onResetAll}
                        className="px-3 py-1.5 text-dark-green hover:text-dark-green-dark text-sm font-medium
                                 transition-colors underline underline-offset-4"
                    >
                        Alle Filter zurücksetzen
                    </button>
                )}
            </div>
        </div>
    );
};