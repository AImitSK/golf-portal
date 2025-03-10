// src/components/clubs/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from "next";
import type { ClubDetailPageProps, GolfClub } from "@/types/club-types";
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
// Components
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import { Heading } from "@/components/frontend-ui/Heading";
import { ClubDetailActions } from "@/components/clubs/ClubDetailActions";
import { ClubDetailTags } from "@/components/clubs/ClubDetailTags";
import ServiceTable from "@/components/clubs/ServiceTable";
import { LikesCounter } from "@/components/clubs/LikesCounter";
import MembershipTable from "@/components/clubs/MembershipTable";
import TournamentTable from "@/components/clubs/TournamentTable";
import ClubMap from "@/components/clubs/ClubMap";
import ClubContact from "@/components/clubs/ClubContact";
import { ClubGallery } from "@/components/clubs/ClubGallery";
import { Cooperations } from '@/components/clubs/Cooperations';
import { PhotoIcon } from "@heroicons/react/24/outline"; // Für ein Fotodarstellung



export async function generateMetadata({ params }: ClubDetailPageProps): Promise<Metadata> {
    const clubs = await getGolfClubs();
    const club = clubs.find((c: GolfClub) => c.slug === params.slug);

    if (!club) {
        return {
            title: 'Golfclub nicht gefunden'
        };
    }

    return {
        title: club.seo?.title || club.title,
        description: club.seo?.description || club.beschreibung,
        keywords: club.seo?.keywords?.join(', '),
    };
}

export async function generateStaticParams() {
    const clubs = await getGolfClubs();
    return clubs.map((club: GolfClub) => ({
        slug: club.slug,
    }));
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
    const clubs = await getGolfClubs();
    const club = clubs.find((c: GolfClub) => c.slug === params.slug);

    if (!club) {
        notFound();
    }

    return (
        <>
            <NavigationFrontend />

            <main>
                {/* Hero Section mit Bild */}
                <div className="relative w-full h-[280px] md:h-[400px] lg:h-[600px]">
                    {club.image ? (
                        // Zeige Club-Bild, wenn verfügbar
                        <img
                            src={club.image}
                            alt={club.title || "Standard Club"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // Zeige Fallback-Icon ("No Image"-Ersatz)
                        <div className="flex items-center justify-center w-full h-full bg-gray-100">
                            <PhotoIcon className="w-10 h-10 text-gray-400"/>
                        </div>
                    )}

                    {/* Likes Counter */}
                    <div className="absolute bottom-3 left-0 w-full">
                        <div className="container mx-auto max-w-[1280px] px-4 lg:px-8">
                            <LikesCounter clubId={club._id}/>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="container mx-auto max-w-[1280px] px-4 lg:px-8">
                    <div className="py-8">
                        {/* Header mit Titel und Actions */}
                        <div className="flex justify-between items-start mb-6">
                            <Heading level={1}>
                                {club.title}
                            </Heading>
                            <ClubDetailActions
                                clubId={club._id}
                                // userId wird später durch Auth hinzugefügt
                            />
                        </div>

                        <div className="mb-8">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 ">
                                <ClubDetailTags club={club}/>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {club.schwierigkeitsgrad && (
                                    <div
                                        className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-dark-green">
                                        Schwierigkeitsgrad: {club.schwierigkeitsgrad}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Logo and Contact Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            {/* Club Logo */}
                            {club.logo && (
                                <div>
                                    <img
                                        src={club.logo}
                                        alt={`${club.title} Logo`}
                                        className="max-w-[250px] h-auto w-full rounded-xl border-2 border-dark-green/20"
                                    />
                                </div>
                            )}

                            {/* Contact Info */}
                            <ClubContact club={club}/>
                        </div>

                        {/* Der Golfclub Section */}
                        <div className="mb-12">
                            <Heading level={2} variant="section">
                                Der Golfclub
                            </Heading>
                            <div className="prose prose-lg max-w-none text-dark-60">
                                <p>
                                    {club.beschreibung ? club.beschreibung : "Keine Informationen über den Club vorhanden."}
                                </p>
                            </div>
                        </div>

                        {/* Bildergalerie */}
                        {club.bildergalerie && club.bildergalerie.length > 0 && (
                            <ClubGallery images={club.bildergalerie}/>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {/* Besonderheiten */}
                            {club.besonderheiten && club.besonderheiten.length > 0 && (
                                <div>
                                    <Heading level={3} className="text-dark-green">Besonderheiten</Heading>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {club.besonderheiten.map((besonderheit: string, index: number) => (
                                            <div key={index}
                                                 className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-cta-green">
                                                {besonderheit}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Übungsanlagen */}
                            {club.uebungsanlagen && club.uebungsanlagen.length > 0 && (
                                <div>
                                    <Heading level={3} className="text-dark-green">Übungsanlagen</Heading>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {club.uebungsanlagen.map((uebungsanlage: string, index: number) => (
                                            <div key={index}
                                                 className="px-3 py-1 rounded-full text-sm font-medium bg-cta-green-15 text-cta-green">
                                                {uebungsanlage}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Maps Section */}
                        <div className="mb-12">
                            <Heading level={2} variant="section">
                                Lage
                            </Heading>
                            <ClubMap club={club}/>
                        </div>

                        {/* Tables Grid */}
                        <div className="mb-12">
                            <Heading level={2} variant="section">
                                Sonstiges
                            </Heading>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Services */}
                            <ServiceTable services={club.services}/>

                            {/* Right Column: Membership and Tournament */}
                            <div className="flex flex-col gap-8">
                                <MembershipTable mitgliedschaft={club.mitgliedschaft}/>
                                <TournamentTable turniere={club.turniere}/>
                            </div>
                        </div>

                        {/* Kooperationen Section */}
                        <Cooperations cooperations={club.kooperationen}/>

                    </div>
                </div>
            </main>

            <FooterFrontend/>
        </>
    );
}