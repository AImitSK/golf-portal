// src/app/kooperation/page.tsx
import React from "react";
import { getKooperation } from "@/lib/sanity/GetKooperation"

import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Alle Golfclubs in Deutschland',
    description: 'Durchsuche und finde die perfekten Golfclubs in deiner Nähe'
};

const KooperationPage = async () => {
    // Daten aus Sanity CMS laden (auf Server-Seite)
    const clubs = await getKooperation();

    return (
        <>
            {/* Navigation */}
            <NavigationFrontend />

            {/* Kooperationen Grid */}
            <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">

            </div>

            {/* Footer */}
            <FooterFrontend />
        </>
    );
};

export default KooperationPage;