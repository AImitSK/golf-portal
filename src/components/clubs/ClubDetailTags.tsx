// src/components/clubs/ClubDetailTags.tsx
'use client';

import React from 'react';
import type { GolfClub } from "@/types/club-types";

interface ClubDetailTagsProps {
    club: GolfClub;
}

export const ClubDetailTags: React.FC<ClubDetailTagsProps> = ({ club }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {club.anzahlLoecher && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-dark-green">
                    {club.anzahlLoecher} Loch
                </div>
            )}
            {club.parGesamt && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-dark-green">
                    Par {club.parGesamt}
                </div>
            )}
            {club.laengeMeter && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-dark-green">
                    {club.laengeMeter}m
                </div>
            )}
            {club.handicapBeschraenkung && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-dark-green">
                    HCP {club.handicapBeschraenkung}
                </div>
            )}
            {club.courseRating && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-dark-green">
                    CR {club.courseRating}
                </div>
            )}
            {club.slope && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-dark-green">
                    Slope {club.slope}
                </div>
            )}
        </div>
    );
};