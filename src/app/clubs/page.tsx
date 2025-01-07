// src/app/clubs/page.tsx
import React from 'react';
import { getGolfClubs } from '@/lib/sanity/getGolfClubs';
import ClubGrid from '@/components/clubs/ClubGrid';

const ClubsPage = async () => {
    // Daten aus Sanity CMS laden
    const clubs = await getGolfClubs();

    return (
        // Container mit responsiven Abstände
        <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">

            <ClubGrid clubs={clubs} />
        </div>
    );
};

export default ClubsPage;