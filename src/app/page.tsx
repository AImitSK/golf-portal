import React from "react";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import { Metadata } from "next";
import PlatformStats from "@/components/frontend-ui/CounterBox";
import { Heading } from "@/components/frontend-ui/Heading";
import {
    MagnifyingGlassIcon,
    TicketIcon,
    HeartIcon,
    FlagIcon,
    StarIcon,
    ShareIcon,
} from '@heroicons/react/24/outline';
import HeroSearch from "@/components/search/HeroSearch";

export const metadata: Metadata = {
    title: 'Kooperationen und Partnerschaften',
    description: 'Entdecken Sie unsere Kooperationspartner und die damit verbundenen Vorteile',
};

const features = [
    {
        name: 'Suchen und vergleichen',
        description: 'Nutze unsere Plattform, um alle Golfplätze in Deutschland zu finden. Egal ob in deiner Nähe oder bundesweit, hier findest du alle Details zu jedem Club.',
        icon: MagnifyingGlassIcon,
    },
    {
        name: 'Greenfee-Kooperationen',
        description: 'Profitiere von exklusiven Rabatten, die dir durch deine Clubmitgliedschaft ermöglicht werden, und spiele günstiger in anderen Golfclubs.',
        icon: TicketIcon,
    },
    {
        name: 'Persönliche Wunschliste',
        description: 'Speichere Golfplätze, die du spielen möchtest, und behalte deine zukünftigen Ziele immer im Blick.',
        icon: HeartIcon,
    },
    {
        name: 'Gespielte Plätze dokumentieren',
        description: 'Halte fest, welche Golfplätze du bereits gespielt hast. Verwalte deine persönlichen Statistiken und Ergebnisse an einem zentralen Ort.',
        icon: FlagIcon,
    },
    {
        name: 'Golfclubs liken und folgen',
        description: 'Markiere deine Lieblingsclubs und bleibe über Neuigkeiten und aktuelle Angebote immer informiert.',
        icon: StarIcon,
    },
    {
        name: 'Deine Empfehlungen teilen',
        description: 'Zeige anderen Golfspielern deine Lieblingsplätze und erstelle Listen, die du mit Freunden oder der Community teilen kannst.',
        icon: ShareIcon,
    },
];

const StartPage = () => {
    return (
        <>
            <NavigationFrontend/>

            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gray-900 h-[850px]">
                <img
                    alt=""
                    src="/hero-golf.webp"
                    className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
                />

                <div className="w-full h-full flex items-start justify-center px-6 py-24 sm:py-40">
                    <div className="w-full max-w-3xl">
                        {/* Text Container */}
                        <div className="text-center px-4 sm:px-6">
                            <Heading level={1} className="text-5xl sm:text-7xl font-bold text-white text-shadow">
                                Deutschlands besten Golfplätze
                            </Heading>
                            <p className="mt-8 text-lg font-medium text-white sm:text-xl/8">
                                Alle Golfplätze Deutschlands an einem Ort. Plane deine nächsten Spiele, speichere deine Ergebnisse und entdecke Greenfee-Vorteile in deiner Nähe.
                            </p>
                        </div>
                        {/* Search Container */}
                        <div className="mt-8 flex justify-center px-4 sm:px-6">
                            <div className="w-full sm:w-[500px]">
                                <HeroSearch/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <Heading level={2} className="text-5xl">
                            Dein Wegweiser durch die Welt des Golfsports
                        </Heading>
                        <p className="mt-6 text-lg/8 text-gray-600">
                            Finde alle Golfplätze in Deutschland. Plane deine nächsten Runden, informiere dich über Greenfee-Kooperationen und erstelle persönliche Listen für eine individuelle Übersicht.
                        </p>
                    </div>
                    <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative text-left pl-9">
                                <dt className="font-semibold text-gray-900 flex items-center">
                                    <feature.icon
                                        aria-hidden="true"
                                        className="h-8 w-8 text-green-600 mr-2"
                                    />
                                    {feature.name}
                                </dt>
                                <dd className="mt-2">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            <PlatformStats/>
            <FooterFrontend/>
        </>
    );
};

export default StartPage;