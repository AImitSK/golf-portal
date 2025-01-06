import React from 'react';
import { Heading } from '@/components/frontend-ui/Heading';

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
};

const ClubCard = ({ club }: { club: GolfClub }) => {
    return (
        <div className="bg-white">
            {/* Bild-Container mit Hover-Effekten */}
            <div
                className="relative rounded-2xl overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-shadow duration-200 group">
                <a href="#" className="block relative w-full aspect-video overflow-hidden">
                    <img
                        src={club.image}
                        alt={club.title}
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                </a>

                {/* Location Tag (oben rechts) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5">
                    <img src="/icons/iconLocationDarkGreen.svg" alt="Standort" className="w-4 h-4"/>
                    <span className="text-sm font-medium text-dark-green">{club.city}</span>
                </div>

                {/* Aktions-Buttons (unten rechts) */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                    <button className="p-2 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                        <img src="/icons/iconShareWithe.svg" alt="Teilen" className="w-5 h-5"/>
                    </button>
                    <button className="p-2 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                        <img src="/icons/iconLoveWithe.svg" alt="Favorit" className="w-5 h-5"/>
                    </button>
                    <button className="p-2 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                        <img src="/icons/iconMenueWithe.svg" alt="Menü" className="w-5 h-5"/>
                    </button>
                </div>

                {/* Likes Counter (unten links) */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5">
                    <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4"/>
                    <span className="text-sm font-medium text-dark-green">1.021</span>
                </div>
            </div>

            {/* Inhalt unterhalb des Bildes */}
            <div className="pt-4 pb-4">
                {/* Titel und Sponsored Tag */}
                <div className="flex justify-between items-start">
                    <a href="#" className="block">
                        <Heading level={2}
                                 className="text-dark-green font-semibold hover:text-dark-green/80 transition-colors pb-4">
                            {club.title}
                        </Heading>
                    </a>
                    <span className="text-xs uppercase tracking-wider text-dark-20">Sponsored</span>
                </div>

                {/* Tags-Container */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {/* Helle Tags für technische Details */}
                    {club.anzahlLoecher && (
                        <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green hover:bg-dark-green hover:text-white transition-colors cursor-pointer">
                            {club.anzahlLoecher} Loch
                        </span>
                    )}
                    {club.parGesamt && (
                        <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green hover:bg-dark-green hover:text-white transition-colors cursor-pointer">
                            Par {club.parGesamt}
                        </span>
                    )}
                    {club.laengeMeter && (
                        <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green hover:bg-dark-green hover:text-white transition-colors cursor-pointer">
                            {club.laengeMeter}m
                        </span>
                    )}
                    {club.handicapBeschraenkung && (
                        <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green hover:bg-dark-green hover:text-white transition-colors cursor-pointer">
                            HCP {club.handicapBeschraenkung}
                        </span>
                    )}
                    {club.courseRating && (
                        <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green hover:bg-dark-green hover:text-white transition-colors cursor-pointer">
                            CR {club.courseRating}
                        </span>
                    )}
                    {club.slope && (
                        <span className="px-3 py-1 bg-dark-green-10 rounded-full text-sm font-medium text-dark-green hover:bg-dark-green hover:text-white transition-colors cursor-pointer">
                            Slope {club.slope}
                        </span>
                    )}

                    {/* Grüne Tags für Platztyp und Besonderheiten */}
                    {club.platztyp && (
                        <span className="px-3 py-1 bg-cta-green text-white rounded-full text-sm font-medium hover:bg-dark-green transition-colors cursor-pointer">
                            {club.platztyp}
                        </span>
                    )}
                    {club.besonderheiten?.map((besonderheit, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-cta-green text-white rounded-full text-sm font-medium hover:bg-dark-green transition-colors cursor-pointer"
                        >
                            {besonderheit}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ClubGrid = ({ clubs }: { clubs: GolfClub[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club, idx) => (
            <ClubCard key={idx} club={club} />
        ))}
    </div>
);

export default ClubGrid;