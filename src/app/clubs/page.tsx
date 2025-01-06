// src/app/clubs/page.tsx
import React from 'react';
import { getGolfClubs } from '@/lib/sanity/getGolfClubs';
import ClubGrid from '@/components/clubs/ClubGrid';

const ClubsPage = async () => {
    // Daten aus Sanity CMS laden
    const clubs = await getGolfClubs();

    return (
        <div className="container mx-auto px-4 py-6">
            <ClubGrid clubs={clubs} />
        </div>
    );
};

export default ClubsPage;