'use client';

import React from 'react';
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import type { GolfClub } from "@/types/club-types";

interface ClubContactProps {
    club: GolfClub;
}

const ClubContact: React.FC<ClubContactProps> = ({ club }) => {
    return (
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-col">
            {/* Mobile Ansicht: Links bündige Icons mit weißem Hintergrund */}
            <div className="flex sm:hidden justify-start gap-3">
                {/* Webseiten-Icon */}
                {club.clubWebsite && (
                    <a
                        href={club.clubWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-dark-green hover:bg-dark-green hover:text-white transition-colors shadow-md"
                    >
                        <GlobeAltIcon className="w-6 h-6" />
                    </a>
                )}

                {/* E-Mail-Icon */}
                {club.clubEmail && (
                    <a
                        href={`mailto:${club.clubEmail}`}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-dark-green hover:bg-dark-green hover:text-white transition-colors shadow-md"
                    >
                        <EnvelopeIcon className="w-6 h-6" />
                    </a>
                )}

                {/* Telefon-Icon */}
                {club.clubTelefon && (
                    <a
                        href={`tel:${club.clubTelefon}`}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-dark-green hover:bg-dark-green hover:text-white transition-colors shadow-md"
                    >
                        <PhoneIcon className="w-6 h-6" />
                    </a>
                )}
            </div>

            {/* Desktop Ansicht: Standardsicht */}
            <div className="hidden sm:flex flex-col gap-3">
                {/* Webseiten-Link */}
                {club.clubWebsite && (
                    <a
                        href={club.clubWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-green-10 text-dark-green hover:bg-dark-green hover:text-white transition-colors shadow-sm"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                            <GlobeAltIcon className="w-5 h-5 text-dark-green" />
                        </div>
                        <span className="text-sm font-medium">{club.clubWebsite}</span>
                    </a>
                )}

                {/* E-Mail-Link */}
                {club.clubEmail && (
                    <a
                        href={`mailto:${club.clubEmail}`}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-green-10 text-dark-green hover:bg-dark-green hover:text-white transition-colors shadow-sm"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                            <EnvelopeIcon className="w-5 h-5 text-dark-green" />
                        </div>
                        <span className="text-sm font-medium">{club.clubEmail}</span>
                    </a>
                )}

                {/* Telefon-Link */}
                {club.clubTelefon && (
                    <a
                        href={`tel:${club.clubTelefon}`}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-green-10 text-dark-green hover:bg-dark-green hover:text-white transition-colors shadow-sm"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                            <PhoneIcon className="w-5 h-5 text-dark-green" />
                        </div>
                        <span className="text-sm font-medium">{club.clubTelefon}</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default ClubContact;