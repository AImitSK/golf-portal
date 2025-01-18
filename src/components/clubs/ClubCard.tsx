// src/components/clubs/ClubCard.tsx
import React from "react";
import {GolfClub, FilterValue} from "@/types/club-types";
import {Heading} from "@/components/frontend-ui/Heading";
import GridNavi from "@/components/frontend-ui/GridNavi";
import {ClubTag, ClubTagArray} from "./ClubTag";
import LocationButton from './LocationButton';
import Link from 'next/link';
import {LikesCounter} from "@/components/clubs/LikesCounter";
import {LikeButton} from './LikeButton';

type ClubCardProps = {
    club: GolfClub;
    layout: "large" | "compact";
    onTagClick: (fieldName: string, value: FilterValue) => void;
};

export const ClubCard = ({club, layout, onTagClick}: ClubCardProps) => {
    const isLargeLayout = layout === "large";

    // Rendere einen Tag nur, wenn der Wert existiert
    const renderTag = (
        fieldName: string,
        value: string | number | undefined,
        colorScheme: "dark-green" | "cta-green",
        prefix?: string,
        suffix?: string
    ) => {
        if (value === undefined || value === null) return null;

        return (
            <ClubTag
                fieldName={fieldName}
                value={value}
                colorScheme={colorScheme}
                prefix={prefix}
                suffix={suffix}
                onClick={onTagClick}
            />
        );
    };

    if (!isLargeLayout) {
        const city = club.adresse?.city || club.city || "Unbekannt";
        const lat = club.adresse?.location?.lat || 0;
        const lng = club.adresse?.location?.lng || 0;

        return (
            <div className="flex gap-6">
                <Link
                    href={`/clubs/${club.slug}`}
                    className="block shrink-0 w-[120px] h-[120px] relative rounded-lg overflow-hidden"
                >
                    <img
                        src={club.image || "/gcl-hero.jpg"}
                        alt={club.title || "Standard Club"}
                        className="w-full h-full object-cover"
                    />
                </Link>

                <div className="flex-1">
                    <Link href={`/clubs/${club.slug}`} className="block mb-3">
                        <Heading
                            level={2}
                            className="text-dark-green font-semibold hover:text-cta-green transition-colors"
                        >
                            {club.title || "Standard Club"}
                        </Heading>
                    </Link>

                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {renderTag("anzahlLoecher", club.anzahlLoecher, "dark-green", undefined, " Loch")}
                            {renderTag("parGesamt", club.parGesamt, "dark-green", "Par")}
                            {renderTag("laengeMeter", club.laengeMeter, "dark-green", undefined, "m")}
                            {renderTag("handicapBeschraenkung", club.handicapBeschraenkung, "dark-green", "HCP")}
                            {renderTag("courseRating", club.courseRating, "dark-green", "CR")}
                            {renderTag("slope", club.slope, "dark-green", "Slope")}
                            {renderTag("platztyp", club.platztyp, "cta-green")}
                            {club.besonderheiten && club.besonderheiten.length > 0 && (
                                <ClubTagArray
                                    fieldName="besonderheiten"
                                    values={club.besonderheiten}
                                    colorScheme="cta-green"
                                    onClick={onTagClick}
                                />
                            )}
                        </div>
                        <LocationButton
                            city={city}
                            coordinates={{ lat, lng }}
                            colorScheme="dark-green"
                            onClick={onTagClick}
                        />
                        <div className="relative flex items-center justify-center h-9 w-9 rounded-full overflow-visible z-10">
                            <GridNavi clubId={club._id} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Großes Layout (original)
    return (
        <div className="bg-white">
            <div className="relative rounded-2xl overflow-visible hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-shadow duration-200">
                {/* Bild-Container mit Link */}
                <Link
                    href={`/clubs/${club.slug}`}
                    className="block relative w-full aspect-[16/9] lg:aspect-[32/9] overflow-hidden rounded-2xl"
                >
                    <img
                        src={club.image || "/gcl-hero.jpg"}
                        alt={club.title || "Standard Club"}
                        className="w-full h-full object-cover"
                    />
                </Link>

                {/* LocationButton mit Koordinaten */}
                <div className="absolute top-3 right-3">
                    <LocationButton
                        city={club.city}
                        coordinates={{
                            lat: club.adresse?.location?.lat || 0,
                            lng: club.adresse?.location?.lng || 0
                        }}
                        colorScheme="dark-green"
                        onClick={onTagClick}
                    />
                </div>

                {/* Aktionen unten rechts */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button className="flex items-center justify-center h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                        <img src="/icons/iconShareWithe.svg" alt="Teilen" className="h-5 w-5"/>
                    </button>
                    <LikeButton
                        clubId={club._id}
                        className="bg-black/30 hover:bg-black/40"
                    />
                    <div className="relative flex items-center justify-center h-9 w-9 rounded-full overflow-visible z-10">
                        <GridNavi clubId={club._id} />
                    </div>
                </div>

                {/* Likes Counter unten links */}
                <div className="absolute bottom-3 left-3">
                    <LikesCounter clubId={club._id}/>
                </div>
            </div>

            <div className="pt-4">
                <div className="flex justify-between items-start mb-4">
                    <Link href={`/clubs/${club.slug}`} className="block">
                        <Heading
                            level={2}
                            className="text-dark-green font-semibold hover:text-cta-green transition-colors"
                        >
                            {club.title}
                        </Heading>
                    </Link>
                    <span className="text-xs uppercase tracking-wider text-dark-20">
                        {club.aktuellesModell?.name || "FREE"}
                    </span>
                </div>

                {/* Tags Container */}
                <div className="mb-4">
                    {/* Mobile: Eine Reihe */}
                    <div className="flex flex-wrap gap-2 lg:hidden">
                        {renderTag("anzahlLoecher", club.anzahlLoecher, "dark-green", undefined, " Loch")}
                        {renderTag("parGesamt", club.parGesamt, "dark-green", "Par")}
                        {renderTag("laengeMeter", club.laengeMeter, "dark-green", undefined, "m")}
                        {renderTag("handicapBeschraenkung", club.handicapBeschraenkung, "dark-green", "HCP")}
                        {renderTag("courseRating", club.courseRating, "dark-green", "CR")}
                        {renderTag("slope", club.slope, "dark-green", "Slope")}
                        {renderTag("platztyp", club.platztyp, "cta-green")}
                        {club.besonderheiten && club.besonderheiten.length > 0 && (
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
                            {renderTag("anzahlLoecher", club.anzahlLoecher, "dark-green", undefined, " Loch")}
                            {renderTag("parGesamt", club.parGesamt, "dark-green", "Par")}
                            {renderTag("laengeMeter", club.laengeMeter, "dark-green", undefined, "m")}
                            {renderTag("handicapBeschraenkung", club.handicapBeschraenkung, "dark-green", "HCP")}
                            {renderTag("courseRating", club.courseRating, "dark-green", "CR")}
                            {renderTag("slope", club.slope, "dark-green", "Slope")}
                        </div>

                        {/* Zweite Reihe - Grüne Tags */}
                        <div className="flex flex-wrap gap-2">
                            {renderTag("platztyp", club.platztyp, "cta-green")}
                            {club.besonderheiten && club.besonderheiten.length > 0 && (
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