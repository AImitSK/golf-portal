"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";
import ClubGrid from "@/components/clubs/ClubGrid";
import { ActiveFilters } from "./ActiveFilters";
import { GolfClub, FilterValue, TagFilters } from "@/types/club-types";

// Hilfsfunktionen für URL-Handling
const encodeFilters = (filters: TagFilters): string => {
    return encodeURIComponent(JSON.stringify(filters));
};

const decodeFilters = (encoded: string | null): TagFilters => {
    if (!encoded) return {};
    try {
        return JSON.parse(decodeURIComponent(encoded));
    } catch {
        return {};
    }
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

    // Initialisiere Filter aus URL oder Props
    const [filterCriteria, setFilterCriteria] = useState<TagFilters>(() => {
        const urlFilters = decodeFilters(searchParams.get('filters'));
        return Object.keys(urlFilters).length > 0 ? urlFilters : initialFilterCriteria;
    });

    // Synchronisiere Filter mit URL
    useEffect(() => {
        const newUrl = Object.keys(filterCriteria).length > 0
            ? `?filters=${encodeFilters(filterCriteria)}`
            : '';
        router.push(newUrl, { scroll: false });
    }, [filterCriteria, router]);

    // Handler für Tag-Klicks
    const handleTagClick = (fieldName: string, value: FilterValue) => {
        setFilterCriteria(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    // Handler zum Entfernen eines Filters
    const handleRemoveFilter = (fieldName: string) => {
        setFilterCriteria(prev => {
            const newFilters = { ...prev };
            delete newFilters[fieldName];
            return newFilters;
        });
    };

    // Handler zum Zurücksetzen aller Filter
    const handleResetAll = () => {
        setFilterCriteria({});
    };

    // Hilfsfunktion für verschachtelte Objekte
    const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
        let current: unknown = obj;
        for (const key of path.split('.')) {
            if (current && typeof current === 'object') {
                current = (current as Record<string, unknown>)[key];
            } else {
                return undefined;
            }
        }
        return current;
    };

    // Filter die Clubs
    const filteredClubs = initialClubs.filter((club) => {
        return Object.entries(filterCriteria).every(([key, filterValue]) => {
            const clubValue = getNestedValue(club as Record<string, unknown>, key);

            if (clubValue === undefined || clubValue === null) return false;
            if (Array.isArray(clubValue)) return clubValue.includes(filterValue);
            if (typeof clubValue === "string" && typeof filterValue === "string") {
                return clubValue.toLowerCase().includes(filterValue.toLowerCase());
            }
            return clubValue === filterValue;
        });
    });

    return (
        <div className="mx-auto max-w-[1280px] px-2 sm:px-4 lg:px-8 space-y-6">
            {/* Active Filters */}
            {Object.keys(filterCriteria).length > 0 && (
                <div className="w-full -mt-6">
                    <div className="border-b border-gray-200">
                        <div className="py-4">
                            <ActiveFilters
                                filters={filterCriteria}
                                onRemoveFilter={handleRemoveFilter}
                                onResetAll={handleResetAll}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Club Grid */}
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