// src/components/clubs/ClubCard.tsx
import React from "react";
import { GolfClub } from "@/types/club-types";
import { Heading } from "@/components/frontend-ui/Heading";
import GridNavi from "@/components/frontend-ui/GridNavi";
import { ClubTag, ClubTagArray } from "./ClubTag";
import LocationButton from './LocationButton';


type ClubCardProps = {
    club: GolfClub;
    showImage: boolean;
    onTagClick: (fieldName: string, value: string | number) => void;
};

export const ClubCard = ({ club, showImage, onTagClick }: ClubCardProps) => {
    return (
        <div className="bg-white">
            {showImage && (
                <div
                    className="relative rounded-2xl overflow-visible hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-shadow duration-200">
                    {/* Bild-Container */}
                    <a href="#"
                       className="block relative w-full aspect-[16/9] lg:aspect-[32/9] overflow-hidden rounded-2xl">
                        <img
                            src={club.image}
                            alt={club.title}
                            className="w-full h-full object-cover"
                        />
                    </a>

                    {/* LocationButton ohne Hover-Interferenz */}
                    <div className="absolute top-3 right-3">
                        <LocationButton
                            city={club.city}
                            colorScheme="dark-green"
                            onClick={onTagClick} // Button-Funktion bleibt gleich
                        />
                    </div>

                    {/* Andere Elemente bleiben gleich */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button
                            className="flex items-center justify-center h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                            <img src="/icons/iconShareWithe.svg" alt="Teilen" className="h-5 w-5"/>
                        </button>
                        <button
                            className="flex items-center justify-center h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                            <img src="/icons/iconLoveWithe.svg" alt="Favorit" className="h-5 w-5"/>
                        </button>
                        <div
                            className="relative flex items-center justify-center h-9 w-9 rounded-full overflow-visible z-10">
                            <GridNavi/>
                        </div>
                    </div>

                    <div
                        className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5">
                        <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4"/>
                        <span className="text-sm font-medium text-dark-green">1.021</span>
                    </div>
                </div>
            )}

            <div className={showImage ? "pt-4" : "pt-0"}>
                <div className="flex justify-between items-start mb-4">
                    <a href="#" className="block">
                        <Heading
                            level={2}
                            className="text-dark-green font-semibold hover:text-cta-green transition-colors"
                        >
                            {club.title}
                        </Heading>
                    </a>
                    <span className="text-xs uppercase tracking-wider text-dark-20">
                        {club.aktuellesModell?.name || "FREE"}
                    </span>
                </div>

                {/* Tags Container */}
                <div className="mb-4">
                    {/* Mobile: Eine Reihe */}
                    <div className="flex flex-wrap gap-2 lg:hidden">
                        <ClubTag
                            fieldName="anzahlLoecher"
                            value={club.anzahlLoecher}
                            colorScheme="dark-green"
                            suffix=" Loch"
                            onClick={onTagClick}
                        />
                        <ClubTag
                            fieldName="parGesamt"
                            value={club.parGesamt}
                            colorScheme="dark-green"
                            prefix="Par"
                            onClick={onTagClick}
                        />
                        <ClubTag
                            fieldName="laengeMeter"
                            value={club.laengeMeter}
                            colorScheme="dark-green"
                            suffix="m"
                            onClick={onTagClick}
                        />
                        <ClubTag
                            fieldName="handicapBeschraenkung"
                            value={club.handicapBeschraenkung}
                            colorScheme="dark-green"
                            prefix="HCP"
                            onClick={onTagClick}
                        />
                        <ClubTag
                            fieldName="courseRating"
                            value={club.courseRating}
                            colorScheme="dark-green"
                            prefix="CR"
                            onClick={onTagClick}
                        />
                        <ClubTag
                            fieldName="slope"
                            value={club.slope}
                            colorScheme="dark-green"
                            prefix="Slope"
                            onClick={onTagClick}
                        />

                        <ClubTag
                            fieldName="platztyp"
                            value={club.platztyp}
                            colorScheme="cta-green"
                            onClick={onTagClick}
                        />

                        {club.besonderheiten && (
                            <ClubTagArray
                                fieldName="besonderheiten"
                                values={club.besonderheiten}
                                colorScheme="cta-green"
                                onClick={onTagClick}
                            />
                        )}
                    </div>

                    {/* Desktop: Zwei Reihen */}
                    <div className="hidden lg:block space-y-2">
                        {/* Erste Reihe - Helle Tags */}
                        <div className="flex flex-wrap gap-2">
                            <ClubTag
                                fieldName="anzahlLoecher"
                                value={club.anzahlLoecher}
                                colorScheme="dark-green"
                                suffix=" Loch"
                                onClick={onTagClick}
                            />
                            <ClubTag
                                fieldName="parGesamt"
                                value={club.parGesamt}
                                colorScheme="dark-green"
                                prefix="Par"
                                onClick={onTagClick}
                            />
                            <ClubTag
                                fieldName="laengeMeter"
                                value={club.laengeMeter}
                                colorScheme="dark-green"
                                suffix="m"
                                onClick={onTagClick}
                            />
                            <ClubTag
                                fieldName="handicapBeschraenkung"
                                value={club.handicapBeschraenkung}
                                colorScheme="dark-green"
                                prefix="HCP"
                                onClick={onTagClick}
                            />
                            <ClubTag
                                fieldName="courseRating"
                                value={club.courseRating}
                                colorScheme="dark-green"
                                prefix="CR"
                                onClick={onTagClick}
                            />
                            <ClubTag
                                fieldName="slope"
                                value={club.slope}
                                colorScheme="dark-green"
                                prefix="Slope"
                                onClick={onTagClick}
                            />
                        </div>

                        {/* Zweite Reihe - Grüne Tags */}
                        <div className="flex flex-wrap gap-2">
                            <ClubTag
                                fieldName="platztyp"
                                value={club.platztyp}
                                colorScheme="cta-green"
                                onClick={onTagClick}
                            />

                            {club.besonderheiten && (
                                <ClubTagArray
                                    fieldName="besonderheiten"
                                    values={club.besonderheiten}
                                    colorScheme="cta-green"
                                    onClick={onTagClick}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};