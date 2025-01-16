import React from "react";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import VerticalNavigation from "@/components/club-backend/VerticalNavigation";
import { Metadata } from "next";
import { Heading } from "@/components/catalyst-ui-kit/heading"; // Import der Heading-Komponente

export const metadata: Metadata = {
    title: "Kooperationen und Partnerschaften",
    description: "Entdecken Sie unsere Kooperationspartner und die damit verbundenen Vorteile",
};

const Profile = async () => {
    return (
        <>
            {/* Kopfbereich */}
            <NavigationFrontend />

            {/* Hauptlayout */}
            <div className="flex justify-center bg-gray-100">

                <div className="flex w-full max-w-[1200px]">
                    {/* Navigation auf der linken Seite */}
                    <aside className="w-[300px] bg-white shadow-md p-4">
                        <VerticalNavigation />
                    </aside>

                    {/* Dynamischer Content auf der rechten Seite */}
                    <main className="flex-1 bg-white shadow-md p-6">
                        {/* Überschrift */}
                        <Heading level={1} className="mb-4">
                            Profil
                        </Heading>
                        <p>Hier wird der dynamische Content geladen.</p>
                    </main>
                </div>
            </div>

            {/* Fußbereich */}
            <FooterFrontend />
        </>
    );
};

export default Profile;