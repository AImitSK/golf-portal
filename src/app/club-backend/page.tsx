import React from "react";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import VerticalNavigation from "@/components/club-backend/VerticalNavigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kooperationen und Partnerschaften",
    description: "Entdecken Sie unsere Kooperationspartner und die damit verbundenen Vorteile",
};

const ClubDashboard = async () => {
    return (
        <>
            {/* Kopfbereich */}
            <NavigationFrontend />

            {/* Hauptlayout */}
            <div className="flex justify-center bg-gray-100">
                {/* Container für max. 1280px Breite */}
                <div className="flex w-full max-w-[1280px]">
                    {/* Navigation auf der linken Seite */}
                    <aside className="w-1/4 bg-white shadow-md p-4">
                        <VerticalNavigation />
                    </aside>

                    {/* Dynamischer Content auf der rechten Seite */}
                    <main className="w-3/4 bg-white shadow-md p-6">
                        <h1 className="text-2xl font-bold">Dashboard-Inhalt</h1>
                        <p>Hier wird der dynamische Content geladen.</p>
                    </main>
                </div>
            </div>

            {/* Fußbereich */}
            <FooterFrontend />
        </>
    );
};

export default ClubDashboard;