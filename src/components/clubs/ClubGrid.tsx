"use client";

import React from "react";
import { sortClubs } from "./sortClubs";
import { ClubCard } from "./ClubCard";
import { GolfClub } from "@/types/club-types";

const ClubGrid = ({ clubs }: { clubs: GolfClub[] }) => {
    const sortedClubs = sortClubs([...clubs]); // Clubs sortieren
    const clubsWithImageFlag = sortedClubs.map((club, index) => {
        const isFreeContract = club.aktuellesModell?.name?.toLowerCase() === "free";
        const isTop5 = index < 5;
        const showImage = !isFreeContract || isTop5; // Logik für das Bild
        return { club, showImage };
    });

    return (
        <div>
            <div className="grid grid-cols-1 gap-8 max-w-screen-xl mx-auto px-4 lg:px-8">
                {clubsWithImageFlag.map(({ club, showImage }, idx) => (
                    <ClubCard key={idx} club={club} showImage={showImage} />
                ))}
            </div>
        </div>
    );
};

export default ClubGrid;