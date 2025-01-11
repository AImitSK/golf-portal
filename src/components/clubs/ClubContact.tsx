// src/components/clubs/ClubContact.tsx
'use client';

import React from 'react';
import { Globe, Phone, Mail } from 'lucide-react';
import type { GolfClub } from "@/types/club-types";

interface ClubContactProps {
    club: GolfClub;
}

const ClubContact: React.FC<ClubContactProps> = ({ club }) => {
    return (
        <div className="space-y-4">
            {club.clubWebsite && (
                <a
                    href={club.clubWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-dark-green hover:text-cta-green transition-colors"
                >
                    <Globe className="w-5 h-5" />
                    <span className="hover:underline">{club.clubWebsite}</span>
                </a>
            )}

            {club.clubEmail && (
                <a
                    href={`mailto:${club.clubEmail}`}
                    className="flex items-center gap-3 text-dark-green hover:text-cta-green transition-colors"
                >
                    <Mail className="w-5 h-5" />
                    <span className="hover:underline">{club.clubEmail}</span>
                </a>
            )}

            {club.clubTelefon && (
                <a
                    href={`tel:${club.clubTelefon}`}
                    className="flex items-center gap-3 text-dark-green hover:text-cta-green transition-colors"
                >
                    <Phone className="w-5 h-5" />
                    <span className="hover:underline">{club.clubTelefon}</span>
                </a>
            )}
        </div>
    );
};

export default ClubContact;