import React from "react";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import { Metadata } from "next";
import PricingTable from "@/components/frontend-ui/PricingTable";

export const metadata: Metadata = {
    title: 'Kooperationen und Partnerschaften',
    description: 'Entdecken Sie unsere Kooperationspartner und die damit verbundenen Vorteile',
};

const StartSeite = async () => {


    return (
        <>
            <NavigationFrontend />

            <PricingTable />




            <FooterFrontend />
        </>
    );
};

export default StartSeite;