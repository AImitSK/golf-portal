"use client";

import React from "react";
import ClubGrid from "@/components/clubs/ClubGrid";
import { GolfClub } from "@/types/club-types";

interface FilterableClubGridProps {
    initialClubs: GolfClub[];
    title?: string;
}

const FilterableClubGrid: React.FC<FilterableClubGridProps> = ({ initialClubs, title }) => {
    const filteredClubs = title
        ? initialClubs.filter((club) =>
            club.title.toLowerCase().includes(title.toLowerCase())
        )
        : initialClubs;

    return (
        <div>
            {/* ClubGrid anzeigen */}
            <ClubGrid clubs={filteredClubs} />
        </div>
    );
};

export default FilterableClubGrid;