// src/app/club-backend/administration/abonnement-rechnungen/page.tsx
import React from "react";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import VerticalNavigation from "@/components/club-backend/VerticalNavigation";
import { Heading } from "@/components/catalyst-ui-kit/heading";
import SubscriptionStatus from "@/components/dashboard/SubscriptionStatus";
import InvoiceTable from "@/components/dashboard/InvoiceTable";
import PlanSelection from "@/components/dashboard/PlanSelection";

export const metadata = {
    title: "Abonnement und Rechnungen",
    description: "Verwalten Sie Ihr Club-Abonnement und Rechnungen",
};

const Abonnement = async () => {
    return (
        <>
            <NavigationFrontend />

            <div className="flex justify-center bg-gray-100">
                <div className="flex w-full max-w-[1200px]">
                    <aside className="w-[300px] bg-white shadow-md p-4">
                        <VerticalNavigation />
                    </aside>

                    <main className="flex-1 bg-white shadow-md p-6">
                        <Heading level={1} className="mb-4">
                            Abonnement und Rechnungen
                        </Heading>

                        <div className="space-y-8">
                            <SubscriptionStatus />

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4">Plan ändern</h2>
                                <PlanSelection />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Rechnungshistorie</h2>
                                <InvoiceTable />
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <FooterFrontend />
        </>
    );
};

export default Abonnement;