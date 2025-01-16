// src/app/stadt/golfplatz-frankfurt/page.tsx
import React from "react";
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import FilterableClubGrid from "@/components/clubs/FilterableClubGrid";
import { Metadata } from "next";
import type { TagFilters } from "@/types/club-types";
import { Heading } from "@/components/frontend-ui/Heading";

export const metadata: Metadata = {
    title: 'Golfplätze in Frankfurt am Main und Umgebung',
    description: 'Entdecken Sie Golfclubs im Umkreis von Frankfurt am Main'
};

const FrankfurtGolfPage = async () => {
    const initialFilterCriteria: TagFilters = {
        geoFilter: {
            lat: 50.1109,  // Koordinaten von Frankfurt am Main
            lng: 8.6821,
            radius: 50     // 50km Radius
        }
    };

    const clubs = await getGolfClubs();

    return (
        <>
            <NavigationFrontend />

            <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">
                <div className="mx-auto max-w-[1280px] px-2 sm:px-4 lg:px-8 space-y-6">
                    <Heading level={1} className="mb-8">
                        Golfplätze in Frankfurt am Main und Umgebung
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

export default FrankfurtGolfPage;