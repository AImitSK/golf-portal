import React from "react";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import { Metadata } from "next";
import PlatformStats from "@/components/frontend-ui/CounterBox";

export const metadata: Metadata = {
  title: 'Kooperationen und Partnerschaften',
  description: 'Entdecken Sie unsere Kooperationspartner und die damit verbundenen Vorteile',
};

const StartSeite = async () => {


  return (
      <>
        <NavigationFrontend />

        {/* Hero Section */}
        <div className="bg-gray-50">
          <div className="max-w-[1280px] mx-auto px-4 py-12 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Startseite
            </h1>
           </div>
        </div>
        <PlatformStats />
        <FooterFrontend />
      </>
  );
};

export default StartSeite;