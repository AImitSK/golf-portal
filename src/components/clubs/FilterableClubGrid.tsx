"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";
import ClubGrid from "@/components/clubs/ClubGrid";
import { ActiveFilters } from "./ActiveFilters";
import { GolfClub, FilterValue, TagFilters, GeoFilterValue } from "@/types/club-types";
import { calculateDistance } from "@/utils/geo-utils";

// Hilfsfunktion für verschachtelte Werte:
const getNestedValue = (obj: unknown, path: string): unknown => {
    if (!obj || typeof obj !== 'object') return undefined;

    return path.split('.').reduce((acc: unknown, key: string) => {
        if (acc === null || acc === undefined || typeof acc !== 'object') {
            return undefined;
        }
        return (acc as Record<string, unknown>)[key];
    }, obj);
};

// URL-Handling-Funktionen
const encodeFilters = (filters: TagFilters): string => {
    return encodeURIComponent(JSON.stringify(filters));
};

const decodeFilters = (encoded: string | null): TagFilters => {
    if (!encoded) return {};
    try {
        const decoded = JSON.parse(decodeURIComponent(encoded)) as TagFilters;
        if (decoded.geoFilter) {
            const geoFilter = decoded.geoFilter;
            if (isGeoFilterValue(geoFilter)) {
                decoded.geoFilter = geoFilter;
            } else {
                delete decoded.geoFilter;
            }
        }
        return decoded;
    } catch {
        return {};
    }
};

// Type Guard für GeoFilterValue
const isGeoFilterValue = (value: unknown): value is GeoFilterValue => {
    if (typeof value !== 'object' || value === null) return false;
    const candidate = value as Record<string, unknown>;
    return (
        typeof candidate.lat === 'number' &&
        typeof candidate.lng === 'number' &&
        typeof candidate.radius === 'number'
    );
};

interface FilterableClubGridProps {
    initialClubs: GolfClub[];
    filterCriteria?: TagFilters;
}

const FilterableClubGrid: React.FC<FilterableClubGridProps> = ({
                                                                   initialClubs,
                                                                   filterCriteria: initialFilterCriteria = {}
                                                               }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filterCriteria, setFilterCriteria] = useState<TagFilters>(() => {
        const urlFilters = decodeFilters(searchParams.get('filters'));
        return Object.keys(urlFilters).length > 0 ? urlFilters : initialFilterCriteria;
    });

    useEffect(() => {
        const newUrl = Object.keys(filterCriteria).length > 0
            ? `?filters=${encodeFilters(filterCriteria)}`
            : '';
        router.push(newUrl, { scroll: false });
    }, [filterCriteria, router]);

    const handleTagClick = (fieldName: string, value: FilterValue) => {
        setFilterCriteria(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleRemoveFilter = (fieldName: string) => {
        setFilterCriteria(prev => {
            const newFilters = { ...prev };
            delete newFilters[fieldName];
            return newFilters;
        });
    };

    const handleResetAll = () => {
        setFilterCriteria({});
    };

    const filteredClubs = initialClubs.filter((club) => {
        return Object.entries(filterCriteria).every(([key, filterValue]) => {
            // Geo-Filter Handling
            if (key === 'geoFilter') {
                if (!isGeoFilterValue(filterValue)) return false;

                const { lat, lng, radius } = filterValue;
                const clubLocation = club.adresse?.location;
                if (!clubLocation?.lat || !clubLocation?.lng) return false;

                const distance = calculateDistance(
                    lat,
                    lng,
                    clubLocation.lat,
                    clubLocation.lng
                );

                return distance <= radius;
            }

            // Normale Filter
            const clubValue = getNestedValue(club, key);

            if (clubValue === undefined || clubValue === null) return false;
            if (Array.isArray(clubValue)) {
                return typeof filterValue === 'string' && clubValue.includes(filterValue);
            }
            if (typeof clubValue === "string" && typeof filterValue === "string") {
                return clubValue.toLowerCase().includes(filterValue.toLowerCase());
            }
            return clubValue === filterValue;
        });
    });

    return (
        <div className="mx-auto max-w-[1280px] px-2 sm:px-4 lg:px-8 space-y-6">
            {Object.keys(filterCriteria).length > 0 && (
                <div className="w-full mt-0">
                    {/* Abstand von 16 Pixel */}
                    <div className="">
                        <div className="flex justify-between items-start py-2 gap-4">
                            {/* Aktive Filter */}
                            <div>
                                <ActiveFilters
                                    filters={filterCriteria}
                                    onRemoveFilter={handleRemoveFilter}
                                    onResetAll={handleResetAll}
                                />
                            </div>
                            {/* Ergebnisse */}
                            <div className="bg-cta-green text-white text-sm font-semibold py-1 px-5 rounded-full flex items-center">
                               {filteredClubs.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={JSON.stringify(filterCriteria)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ClubGrid
                            clubs={filteredClubs}
                            onTagClick={handleTagClick}
                        />
                    </motion.div>
                </AnimatePresence>

                {filteredClubs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-lg text-gray-600">
                            Keine Golfclubs gefunden, die den ausgewählten Kriterien entsprechen.
                        </p>
                        <button
                            onClick={handleResetAll}
                            className="mt-4 text-dark-green hover:text-dark-green-dark underline underline-offset-4"
                        >
                            Filter zurücksetzen
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FilterableClubGrid;