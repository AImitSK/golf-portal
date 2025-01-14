// src/components/clubs/FilterableClubGrid.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";
import ClubGrid from "@/components/clubs/ClubGrid";
import { ActiveFilters } from "./ActiveFilters";
import { FilterMapPreview } from './FilterMapPreview';
import { GolfClub, FilterValue, TagFilters, GeoFilterValue } from "@/types/club-types";
import { calculateDistance } from "@/utils/geo-utils";

const getNestedValue = (obj: unknown, path: string): unknown => {
    if (!obj || typeof obj !== 'object') return undefined;
    return path.split('.').reduce((acc: unknown, key: string) => {
        if (acc === null || acc === undefined || typeof acc !== 'object') {
            return undefined;
        }
        return (acc as Record<string, unknown>)[key];
    }, obj);
};

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
    const [displayCount, setDisplayCount] = useState(10);

    const [filterCriteria, setFilterCriteria] = useState<TagFilters>(() => {
        const urlFilters = decodeFilters(searchParams.get('filters'));
        return Object.keys(urlFilters).length > 0 ? urlFilters : initialFilterCriteria;
    });

    useEffect(() => {
        setDisplayCount(10);
    }, [filterCriteria]);

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

        // Smooth scroll nach oben
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleRemoveFilter = (fieldName: string) => {
        setFilterCriteria(prev => {
            const newFilters = { ...prev };
            delete newFilters[fieldName];
            return newFilters;
        });

        // Smooth scroll nach oben
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleResetAll = () => {
        setFilterCriteria({});

        // Smooth scroll nach oben
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 10);
    };

    const filteredClubs = initialClubs.filter((club) => {
        return Object.entries(filterCriteria).every(([key, filterValue]) => {
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

    const displayedClubs = filteredClubs.slice(0, displayCount);

    return (
        <div className="mx-auto max-w-[1280px] px-2 sm:px-4 lg:px-8 space-y-6">
            {Object.keys(filterCriteria).length > 0 && (
                <div className="bg-gray-50 rounded-xl shadow-sm px-6 pt-6 mb-8">
                    {/* Kartenvorschau */}
                    <div className="w-full mb-6">
                        <FilterMapPreview
                            clubs={filteredClubs}
                            geoFilter={filterCriteria.geoFilter as GeoFilterValue | undefined}
                        />
                    </div>

                    {/* Filter und Anzahl */}
                    <div className="flex items-start justify-between py-2 gap-4">
                        <div className="flex flex-wrap gap-2">
                            <ActiveFilters
                                filters={filterCriteria}
                                onRemoveFilter={handleRemoveFilter}
                                onResetAll={handleResetAll}
                            />
                        </div>
                        <div className="flex items-center">
                            <div
                                className="bg-cta-green text-white text-sm font-semibold py-1 px-5 rounded-full"
                            >
                                {filteredClubs.length}
                            </div>
                            <span className="ml-2 text-sm font-semibold text-gray-600">Clubs</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={JSON.stringify(filterCriteria)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ClubGrid
                            clubs={displayedClubs}
                            onTagClick={handleTagClick}
                        />
                    </motion.div>
                </AnimatePresence>

                {filteredClubs.length > displayCount && (
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-2 bg-dark-green text-white rounded-full hover:bg-cta-green transition-colors duration-200"
                        >
                            Weitere Golfclubs laden
                        </button>
                    </div>
                )}

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