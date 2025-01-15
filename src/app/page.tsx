import React from "react";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import { Metadata } from "next";
import PlatformStats from "@/components/frontend-ui/CounterBox";
import { Heading } from "@/components/frontend-ui/Heading";
import Button from "@/components/frontend-ui/Button";
import { ArrowPathIcon, CloudArrowUpIcon, Cog6ToothIcon, FingerPrintIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';
import HeroSearch from "@/components/search/HeroSearch";

export const metadata: Metadata = {
    title: 'Kooperationen und Partnerschaften',
    description: 'Entdecken Sie unsere Kooperationspartner und die damit verbundenen Vorteile',
};

const features = [
    {
        name: 'Push to deploy.',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'SSL certificates.',
        description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
        icon: LockClosedIcon,
    },
    {
        name: 'Simple queues.',
        description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus voluptas blanditiis et.',
        icon: ArrowPathIcon,
    },
    {
        name: 'Advanced security.',
        description: 'Iure sed ab. Aperiam optio placeat dolor facere. Officiis pariatur eveniet atque et dolor.',
        icon: FingerPrintIcon,
    },
    {
        name: 'Powerful API.',
        description: 'Laudantium tempora sint ut consectetur ratione. Ut illum ut rem numquam fuga delectus.',
        icon: Cog6ToothIcon,
    },
    {
        name: 'Database backups.',
        description: 'Culpa dolorem voluptatem velit autem rerum qui et corrupti. Quibusdam quo placeat.',
        icon: ServerIcon,
    },
];

const StartPage = () => {
    return (
        <>
            <NavigationFrontend/>



            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gray-900 h-screen">
                <img
                    alt=""
                    src="/gcl-hero.jpg"
                    className="absolute inset-0 -z-10 size-full object-cover h-full"
                />

                <div className="w-full h-full flex items-start justify-center px-6 py-24 sm:py-40">
                    <div className="w-full max-w-3xl">
                        {/* Text Container - behält volle Breite */}
                        <div className="text-center px-4 sm:px-6">
                            <Heading level={1} className="text-5xl sm:text-7xl font-bold text-dark-green">
                                Deutschlands besten Golfplätze
                            </Heading>
                            <p className="mt-8 text-lg font-medium text-gray-900 sm:text-xl/8">
                                Wir vernetzen Deutschlands Golfwelt. Unsere Plattform verbindet Privatclubs und öffentliche Golfanlagen. Nutzen Sie bundesweite Greenfee-Vorteile für Ihr Golfspiel.
                            </p>
                        </div>
                        {/* Search Container - zentriert und schmaler */}
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
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <div className="mx-auto max-w-2xl">
                        <Heading level={2} className="text-5xl">
                            Alles was Sie brauchen
                        </Heading>
                        <p className="mt-6 text-lg/8 text-gray-600">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis
                            suscipit eaque, iste dolor cupiditate blanditiis.
                        </p>
                    </div>
                    <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-9">
                                <dt className="inline font-semibold text-gray-900">
                                    <feature.icon aria-hidden="true"
                                                  className="absolute left-1 top-1 size-5 text-green-600"/>
                                    {feature.name}
                                </dt>
                                {' '}
                                <dd className="inline">{feature.description}</dd>
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