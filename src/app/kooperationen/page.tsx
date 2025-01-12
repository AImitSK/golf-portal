// src/app/kooperation/page.tsx
import React from "react";
import { getKooperation } from "@/lib/sanity/GetKooperation";

import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import KoopGrid from "@/components/kooperationen/KoopGrid"; // KORREKTER PFAD
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Alle Golfclubs in Deutschland',
    description: 'Durchsuche und finde die perfekten Golfclubs in deiner Nähe',
};

const KooperationPage = async () => {
    // Daten aus Sanity CMS laden (auf Server-Seite)
    const kooperationen = await getKooperation();

    return (
        <>
            {/* Navigation */}
            <NavigationFrontend />

            {/* Kooperationen Grid */}
            <div className="container mx-auto px-0 py-6 lg:px-6 xl:px-8">
                <h1 className="text-2xl font-bold mb-4">Unsere Kooperationen</h1>
                <KoopGrid kooperationen={kooperationen} />
            </div>

            {/* Footer */}
            <FooterFrontend />
        </>
    );
};

export default KooperationPage;