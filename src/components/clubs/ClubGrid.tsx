"use client";

import React from "react";
import { sortClubs } from "@/utils/sortClubs";
import { ClubCard } from "./ClubCard";
import { GolfClub, FilterValue } from "@/types/club-types";

interface ClubGridProps {
    clubs: GolfClub[];
    onTagClick: (fieldName: string, value: FilterValue) => void;
}

const ClubGrid: React.FC<ClubGridProps> = ({ clubs, onTagClick }) => {
    const sortedClubs = sortClubs([...clubs]);

    // Teile die Clubs in zwei Gruppen: Top 5 und Rest
    const topClubs = sortedClubs.slice(0, 5);
    const remainingClubs = sortedClubs.slice(5);

    return (
        <div className="space-y-8">
            {/* Top 5 Clubs - Original Layout */}
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
                    {/* Subtiler Divider */}
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

                    {/* Restliche Clubs - Kompaktes Layout */}
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
};

export default ClubGrid;