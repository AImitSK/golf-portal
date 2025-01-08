// src/app/clubs/page.tsx
import React from "react";
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import FilterableClubGrid from "@/components/clubs/FilterableClubGrid";

const ClubsPage = async () => {
    // Daten aus Sanity CMS laden (auf Server-Seite)
    const clubs = await getGolfClubs();

    return (
        <>
            {/* Navigation */}
            <NavigationFrontend />

            {/* FilterableClubGrid */}
            <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">
                {/* Übergabe der initialen Clubs-Daten mit Titel-Filtern */}
                <FilterableClubGrid
                    initialClubs={clubs}
                    filterCriteria={{
                        title: "Golf-Club Widukind-Land e.V.",
                        anzahlLoecher: 18,
                        "services.restaurant": true, // Korrekte Zuordnung zu Subfeld unter "services"
                        platztyp: "Mountain Course",
                    }}
                />
            </div>

            {/* Footer */}
            <FooterFrontend />
        </>
    );
};

export default ClubsPage;