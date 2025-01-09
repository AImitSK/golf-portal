// src/app/clubs/page.tsx
import React from 'react';
import { getGolfClubs } from '@/lib/sanity/getGolfClubs';
import ClubGrid from '@/components/clubs/ClubGrid';
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";

const ClubsPage = async () => {
    // Daten aus Sanity CMS laden
    const clubs = await getGolfClubs();

    return (
        // Container mit responsiven Abstände
        <>
            <>
                <NavigationFrontend />
            </>
            <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">
                <ClubGrid clubs={clubs} />
            </div>
            <>
                <FooterFrontend />
            </>
        </>
    );
};

export default ClubsPage;