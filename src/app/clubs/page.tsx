// src/app/clubs/page.tsx
import React from "react";
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import ClubGrid from "@/components/clubs/ClubGrid"; // Neuer Import

const ClubsPage = async () => {
    // Daten aus Sanity CMS laden (auf Server-Seite)
    const clubs = await getGolfClubs();

    return (
        <>
            {/* Navigation */}
            <NavigationFrontend />

            {/* ClubGrid */}
            <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">
                <ClubGrid clubs={clubs} />
            </div>

            {/* Footer */}
            <FooterFrontend />
        </>
    );
};

export default ClubsPage;