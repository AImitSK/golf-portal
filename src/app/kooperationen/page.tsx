// src/app/kooperationen/page.tsx
import React from "react";
import { getKooperation } from "@/lib/sanity/GetKooperation";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import KoopGrid from "@/components/kooperationen/KoopGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Kooperationen und Partnerschaften',
    description: 'Entdecken Sie unsere Kooperationspartner und die damit verbundenen Vorteile',
};

const KooperationPage = async () => {
    const kooperationen = await getKooperation();

    return (
        <>
            <NavigationFrontend />

            {/* Hero Section */}
            <div className="bg-gray-50">
                <div className="max-w-[1280px] mx-auto px-4 py-12 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Unsere Kooperationen
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        Profitieren Sie von unseren starken Partnerschaften und exklusiven Vereinbarungen.
                        Als Mitglied genießen Sie besondere Vorteile bei allen unseren Kooperationspartnern.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <main className="max-w-[1280px] mx-auto px-4 py-12 lg:px-8">
                <KoopGrid kooperationen={kooperationen} />
            </main>

            <FooterFrontend />
        </>
    );
};

export default KooperationPage;