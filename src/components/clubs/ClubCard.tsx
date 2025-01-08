import React from "react";
import { GolfClub } from "@/types/club-types";
import { Heading } from "@/components/frontend-ui/Heading";
import GridNavi from "@/components/frontend-ui/GridNavi";

type ClubCardProps = {
    club: GolfClub;
    showImage: boolean;
};

export const ClubCard = ({ club, showImage }: ClubCardProps) => {
    return (
        <div className="bg-white">
            {showImage && (
                <div className="relative rounded-2xl overflow-visible group hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-shadow duration-200">
                    <a href="#" className="block relative w-full aspect-[16/9] lg:aspect-[32/9] overflow-hidden rounded-2xl">
                        <img src={club.image} alt={club.title} className="w-full h-full object-cover" />
                    </a>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5">
                        <img src="/icons/iconLocationDarkGreen.svg" alt="Standort" className="w-4 h-4" />
                        <span className="text-sm font-medium text-dark-green">{club.city}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button className="flex items-center justify-center h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                            <img src="/icons/iconShareWithe.svg" alt="Teilen" className="h-5 w-5" />
                        </button>
                        <button className="flex items-center justify-center h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                            <img src="/icons/iconLoveWithe.svg" alt="Favorit" className="h-5 w-5" />
                        </button>
                        <div className="relative flex items-center justify-center h-9 w-9 rounded-full overflow-visible z-10">
                            <GridNavi />
                        </div>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5">
                        <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4" />
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

                {/* Container für alle Tags */}
                <div className="mb-4">
                    {/* Mobile: Eine Reihe */}
                    <div className="flex flex-wrap gap-2 lg:hidden">
                        {/* Helle Tags */}
                        {club.anzahlLoecher && (
                            <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                {club.anzahlLoecher} Loch
                            </span>
                        )}
                        {club.parGesamt && (
                            <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                Par {club.parGesamt}
                            </span>
                        )}
                        {club.laengeMeter && (
                            <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                {club.laengeMeter}m
                            </span>
                        )}
                        {club.handicapBeschraenkung && (
                            <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                HCP {club.handicapBeschraenkung}
                            </span>
                        )}
                        {club.courseRating && (
                            <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                CR {club.courseRating}
                            </span>
                        )}
                        {club.slope && (
                            <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                Slope {club.slope}
                            </span>
                        )}

                        {/* Grüne Tags direkt dahinter */}
                        {club.platztyp && (
                            <span className="px-3 py-1 bg-cta-green text-white rounded-full text-sm font-medium">
                                {club.platztyp}
                            </span>
                        )}
                        {club.besonderheiten?.map((besonderheit: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-cta-green text-white rounded-full text-sm font-medium">
                                {besonderheit}
                            </span>
                        ))}
                    </div>

                    {/* Desktop: Zwei Reihen */}
                    <div className="hidden lg:block space-y-2">
                        {/* Helle Tags */}
                        <div className="flex flex-wrap gap-2">
                            {club.anzahlLoecher && (
                                <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                    {club.anzahlLoecher} Loch
                                </span>
                            )}
                            {club.parGesamt && (
                                <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                    Par {club.parGesamt}
                                </span>
                            )}
                            {club.laengeMeter && (
                                <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                    {club.laengeMeter}m
                                </span>
                            )}
                            {club.handicapBeschraenkung && (
                                <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                    HCP {club.handicapBeschraenkung}
                                </span>
                            )}
                            {club.courseRating && (
                                <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                    CR {club.courseRating}
                                </span>
                            )}
                            {club.slope && (
                                <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green">
                                    Slope {club.slope}
                                </span>
                            )}
                        </div>

                        {/* Grüne Tags */}
                        <div className="flex flex-wrap gap-2">
                            {club.platztyp && (
                                <span className="px-3 py-1 bg-cta-green text-white rounded-full text-sm font-medium">
                                    {club.platztyp}
                                </span>
                            )}
                            {club.besonderheiten?.map((besonderheit: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-cta-green text-white rounded-full text-sm font-medium">
                                    {besonderheit}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};