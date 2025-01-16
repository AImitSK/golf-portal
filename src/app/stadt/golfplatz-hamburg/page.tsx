// src/app/stadt/golfplatz-hamburg/page.tsx
import React from "react";
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import FilterableClubGrid from "@/components/clubs/FilterableClubGrid";
import { Metadata } from "next";
import type { TagFilters } from "@/types/club-types";
import { Heading } from "@/components/frontend-ui/Heading";

export const metadata: Metadata = {
    title: 'Golfplätze in Hamburg und Umgebung',
    description: 'Entdecken Sie Golfclubs im Umkreis von Hamburg'
};

const HamburgGolfPage = async () => {
    const initialFilterCriteria: TagFilters = {
        geoFilter: {
            lat: 53.5511,
            lng: 9.9937,
            radius: 50
        }
    };

    const clubs = await getGolfClubs();

    return (
        <>
            <NavigationFrontend />

            {/* Outer container für Konsistenz mit der Club-Seite */}
            <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">
                {/* Inner container für max-width Konsistenz */}
                <div className="mx-auto max-w-[1280px] px-2 sm:px-4 lg:px-8 space-y-6 mb-8">
                    <Heading level={1}>
                        Golfplätze in Hamburg und Umgebung
                    </Heading>
                </div>

                <FilterableClubGrid
                    initialClubs={clubs}
                    filterCriteria={initialFilterCriteria}
                />
            </div>

            <FooterFrontend />
        </>
    );
};

export default HamburgGolfPage;