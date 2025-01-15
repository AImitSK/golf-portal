// src/app/clubs/page.tsx
import React from "react";
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import FilterableClubGrid from "@/components/clubs/FilterableClubGrid";
import { Metadata } from "next";
import Breadcrumbs from "@/components/frontend-ui/Breadcrumbs";

export const metadata: Metadata = {
    title: 'Alle Golfclubs in Deutschland',
    description: 'Durchsuche und finde die perfekten Golfclubs in deiner Nähe'
};

const ClubsPage = async () => {
    // Daten aus Sanity CMS laden (auf Server-Seite)
    const clubs = await getGolfClubs();

    return (
        <>
            {/* Navigation */}
            <NavigationFrontend />

            {/* FilterableClubGrid */}
            <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">
                {/* Übergabe der initialen Clubs-Daten ohne initiale Filter */}
                <FilterableClubGrid
                    initialClubs={clubs}
                />
            </div>

            {/* Footer */}
            <FooterFrontend />
        </>
    );
};

export default ClubsPage;