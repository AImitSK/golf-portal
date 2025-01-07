import React from 'react';
import { Heading } from '@/components/frontend-ui/Heading';
import GridNavi from '@/components/frontend-ui/GridNavi';

type GolfClub = {
    title: string;
    image: string;
    city?: string;
    clubEmail?: string;
    clubTelefon?: string;
    clubWebsite?: string;
    anzahlLoecher?: number;
    parGesamt?: number;
    laengeMeter?: number;
    handicapBeschraenkung?: number;
    courseRating?: number;
    slope?: number;
    platztyp?: string;
    besonderheiten?: string[];
    aktuellesModell?: {
        name: string;
        isTopPosition?: boolean;
        topPositionRank?: number;
    };
};

const sortClubs = (clubs: GolfClub[]) => {
    return clubs.sort((a, b) => {
        // Clubs ohne Vertragsmodell ans Ende
        if (!a.aktuellesModell && b.aktuellesModell) return 1;
        if (a.aktuellesModell && !b.aktuellesModell) return -1;
        if (!a.aktuellesModell || !b.aktuellesModell) return 0;

        // TOP Position Vergleich (jetzt wissen wir, dass beide aktuellesModell haben)
        const aIsTop = !!a.aktuellesModell?.isTopPosition;
        const bIsTop = !!b.aktuellesModell?.isTopPosition;
        if (aIsTop && !bIsTop) return -1;
        if (!aIsTop && bIsTop) return 1;

        // Wenn beide TOP Position haben, nach Rank sortieren
        if (aIsTop && bIsTop) {
            return (a.aktuellesModell.topPositionRank || 0) - (b.aktuellesModell.topPositionRank || 0);
        }

        // Free vs. Paid Vergleich
        const aIsFree = a.aktuellesModell.name?.toLowerCase() === 'free';
        const bIsFree = b.aktuellesModell.name?.toLowerCase() === 'free';
        if (!aIsFree && bIsFree) return -1;
        if (aIsFree && !bIsFree) return 1;

        return 0;
    });
};

const ClubCard = ({ club, showImage }: { club: GolfClub; showImage: boolean }) => {
    return (
        <div className="bg-white">
            {showImage && (
                <div className="relative rounded-2xl overflow-visible group hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-shadow duration-200">
                    <a href="#" className="block relative w-full aspect-[16/9] lg:aspect-[32/9] overflow-hidden rounded-2xl">
                        <img
                            src={club.image}
                            alt={club.title}
                            className="w-full h-full object-cover"
                        />
                    </a>

                    {/* Standort-Tag (oben rechts) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5">
                        <img src="/icons/iconLocationDarkGreen.svg" alt="Standort" className="w-4 h-4" />
                        <span className="text-sm font-medium text-dark-green">{club.city}</span>
                    </div>

                    {/* Aktionsbuttons (unten rechts) */}
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

                    {/* Likes-Zähler (unten links) */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5">
                        <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4" />
                        <span className="text-sm font-medium text-dark-green">1.021</span>
                    </div>
                </div>
            )}

            {/* Content unterhalb des Bildes */}
            <div className={showImage ? "pt-4" : "pt-0"}>
                <div className="flex justify-between items-start mb-4">
                    <a href="#" className="block">
                        <Heading
                            level={2}
                            className="text-dark-green font-semibold hover:text-cta-green transition-colors">
                            {club.title}
                        </Heading>
                    </a>
                    <span className="text-xs uppercase tracking-wider text-dark-20">
                        {club.aktuellesModell?.name || 'FREE'}
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
                        {club.besonderheiten?.map((besonderheit, index) => (
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
                            {club.besonderheiten?.map((besonderheit, index) => (
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

const ClubGrid = ({ clubs }: { clubs: GolfClub[] }) => {
    // Sortiere die Clubs
    const sortedClubs = sortClubs([...clubs]);

    // Bestimme für jeden Club, ob ein Bild angezeigt werden soll
    const clubsWithImageFlag = sortedClubs.map((club, index) => {
        const isFreeContract = club.aktuellesModell?.name?.toLowerCase() === 'free';
        const isTop5 = index < 5;
        const showImage = !isFreeContract || isTop5;

        return { club, showImage };
    });

    return (
        <div className="grid grid-cols-1 gap-8 max-w-screen-xl mx-auto px-4 lg:px-8">
            {clubsWithImageFlag.map(({club, showImage}, idx) => (
                <ClubCard
                    key={idx}
                    club={club}
                    showImage={showImage}
                />
            ))}
        </div>
    );
};

export default ClubGrid;