// src/components/clubs/ClubGrid.tsx
"use client";

import { memo, useMemo } from "react";
import { sortClubs } from "@/utils/sortClubs";
import type { GolfClub, FilterValue } from "@/types/club-types";
import { ClubCard } from "./ClubCard";

interface ClubGridProps {
    clubs: GolfClub[];
    onTagClick: (fieldName: string, value: FilterValue) => void;
}

const Divider = memo(function Divider() {
    return (
        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-dark-green/10"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-dark-green/60">
                    Weitere Golfclubs
                </span>
            </div>
        </div>
    );
});

const ClubGrid = memo(function ClubGrid({ clubs, onTagClick }: ClubGridProps) {
    // Memoize the sorted clubs
    const { topClubs, remainingClubs } = useMemo(() => {
        const sortedClubs = sortClubs([...clubs]);
        return {
            topClubs: sortedClubs.slice(0, 5),
            remainingClubs: sortedClubs.slice(5)
        };
    }, [clubs]);

    return (
        <div className="space-y-8">
            {/* Top 5 Clubs */}
            <div className="grid grid-cols-1 gap-8">
                {topClubs.map((club) => (
                    <ClubCard
                        key={club.slug}
                        club={club}
                        layout="large"
                        onTagClick={onTagClick}
                    />
                ))}
            </div>

            {remainingClubs.length > 0 && (
                <>
                    <Divider />
                    <div className="grid grid-cols-1 gap-12">
                        {remainingClubs.map((club) => (
                            <ClubCard
                                key={club.slug}
                                club={club}
                                layout="compact"
                                onTagClick={onTagClick}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});

export default ClubGrid;