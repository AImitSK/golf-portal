// src/app/clubs/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
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
import { generateMetadata as genMeta } from '@/components/frontend-ui/SEO';
import type { GolfClub } from "@/types/club-types";

interface ClubDetailPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: ClubDetailPageProps): Promise<Metadata> {
    const clubs = await getGolfClubs();
    const club = clubs.find((c: GolfClub) => c.slug === params.slug);

    if (!club) return {};

    return genMeta({
        title: club.title,
        description: club.seo?.description || club.beschreibung,
        keywords: club.seo?.keywords,
        image: club.image,
        type: 'article'
    });
}

export async function generateStaticParams() {
    const clubs = await getGolfClubs();
    return clubs.map((club: GolfClub) => ({
        slug: club.slug,
    }));
}

async function ClubDetailPage({ params }: ClubDetailPageProps) {
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
                    <img
                        src={club.image}
                        alt={club.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Likes Counter */}
                    <div className="absolute bottom-3 left-0 w-full">
                        <div className="container mx-auto max-w-[1280px] px-4 lg:px-8">
                            <LikesCounter count={1021} />
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
                            <ClubDetailActions />
                        </div>

                        {/* Tags */}
                        <div className="mb-8">
                            <ClubDetailTags club={club} />
                        </div>

                        {/* Der Golfclub Section */}
                        <div className="mb-12">
                            <Heading level={2} variant="section">
                                Der Golfclub
                            </Heading>
                            <div className="prose prose-lg max-w-none text-dark-60">
                                <p>{club.beschreibung || 'Keine Beschreibung verfügbar.'}</p>
                            </div>
                        </div>

                        {/* Tables Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Services */}
                            <ServiceTable services={club.services} />

                            {/* Right Column: Membership and Tournament */}
                            <div className="flex flex-col gap-8">
                                <MembershipTable mitgliedschaft={club.mitgliedschaft} />
                                <TournamentTable turniere={club.turniere} />
                            </div>
                        </div>

                        {/* Maps Section */}
                        <div className="mb-12">
                            <Heading level={2} variant="section">
                                Lage
                            </Heading>
                            <ClubMap club={club} />
                        </div>
                    </div>
                </div>
            </main>

            <FooterFrontend />
        </>
    );
}

export default ClubDetailPage;