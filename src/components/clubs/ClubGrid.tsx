"use client";
import React, { useState } from "react";
import { sortClubs } from "./sortClubs";
import { ClubCard } from "./ClubCard";
import { GolfClub } from "@/types/club-types";

const ClubGrid = ({ clubs }: { clubs: GolfClub[] }) => {
    const sortedClubs = sortClubs([...clubs]);
    const clubsWithImageFlag = sortedClubs.map((club, index) => {
        const isFreeContract = club.aktuellesModell?.name?.toLowerCase() === "free";
        const isTop5 = index < 5;
        const showImage = !isFreeContract || isTop5;
        return { club, showImage };
    });

    const [visibleClubs, setVisibleClubs] = useState(10);

    const handleLoadMore = () => {
        setVisibleClubs((prev) => prev + 10);
    };

    return (
        <div>
            <div className="grid grid-cols-1 gap-8 max-w-screen-xl mx-auto px-4 lg:px-8">
                {clubsWithImageFlag.slice(0, visibleClubs).map(({ club, showImage }, idx) => (
                    <ClubCard key={idx} club={club} showImage={showImage} />
                ))}
            </div>
            {visibleClubs < clubsWithImageFlag.length && (
                <div className="text-center mt-6">
                    <button
                        onClick={handleLoadMore}
                        className="bg-cta-green text-white px-4 py-2 rounded hover:bg-cta-green-dark transition-colors"
                    >
                        Mehr Laden
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClubGrid;