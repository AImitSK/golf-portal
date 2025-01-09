"use client";

import React from "react";
import { sortClubs } from "./sortClubs";
import { ClubCard } from "./ClubCard";
import { GolfClub } from "@/types/club-types";

interface ClubGridProps {
    clubs: GolfClub[];
    onTagClick: (fieldName: string, value: string | number) => void;
}

const ClubGrid: React.FC<ClubGridProps> = ({ clubs, onTagClick }) => {
    const sortedClubs = sortClubs([...clubs]);
    const clubsWithImageFlag = sortedClubs.map((club, index) => {
        const isFreeContract = club.aktuellesModell?.name?.toLowerCase() === "free";
        const isTop5 = index < 5;
        const showImage = !isFreeContract || isTop5;
        return { club, showImage };
    });

    return (
        <div className="grid grid-cols-1 gap-8">
            {clubsWithImageFlag.map(({ club, showImage }, idx) => (
                <ClubCard
                    key={idx}
                    club={club}
                    showImage={showImage}
                    onTagClick={onTagClick}
                />
            ))}
        </div>
    );
};

export default ClubGrid;