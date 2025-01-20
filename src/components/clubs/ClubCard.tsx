// src/components/clubs/ClubCard.tsx
'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import type { ClubCardProps } from '@/types/ClubComponentTypes';
import { Heading } from '@/components/frontend-ui/Heading';
import ClubCardImage from './ClubCardImage';
import ClubTagSection from './ClubTagSection';
import ClubTagArray from './ClubTagArray';
import ClubActions from './ClubActions';
import LocationButton from './LocationButton';
import { LikesCounter } from './LikesCounter';

export const ClubCard = memo(function ClubCard({
                                                   club,
                                                   layout,
                                                   onTagClick
                                               }: ClubCardProps) {
    const isLargeLayout = layout === 'large';

    // Compact Layout
    if (!isLargeLayout) {
        const city = club.adresse?.city || club.city || 'Unbekannt';
        const lat = club.adresse?.location?.lat || 0;
        const lng = club.adresse?.location?.lng || 0;

        return (
            <div className="flex gap-6">
                <ClubCardImage
                    slug={club.slug}
                    image={club.image}
                    title={club.title}
                    isLarge={false}
                />

                <div className="flex-1">
                    <Link href={`/clubs/${club.slug}`} className="block mb-3">
                        <Heading
                            level={2}
                            className="text-dark-green font-semibold hover:text-cta-green transition-colors"
                        >
                            {club.title || 'Golf Club'}
                        </Heading>
                    </Link>

                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            <ClubTagSection
                                club={club}
                                colorScheme="dark-green"
                                onTagClick={onTagClick}
                            />
                            {club.besonderheiten && club.besonderheiten.length > 0 && (
                                <ClubTagArray
                                    fieldName="besonderheiten"
                                    values={club.besonderheiten}
                                    colorScheme="cta-green"
                                    onClick={onTagClick}
                                />
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <LocationButton
                                city={city}
                                coordinates={{ lat, lng }}
                                colorScheme="dark-green"
                                onClick={onTagClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Large Layout
    return (
        <div className="bg-white">
            <div className="relative rounded-2xl overflow-visible hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-shadow duration-200">
                <ClubCardImage
                    slug={club.slug}
                    image={club.image}
                    title={club.title}
                    isLarge={true}
                />

                <div className="absolute top-3 right-3">
                    <LocationButton
                        city={club.city}
                        coordinates={{
                            lat: club.adresse?.location?.lat || 0,
                            lng: club.adresse?.location?.lng || 0
                        }}
                        colorScheme="dark-green"
                        onClick={onTagClick}
                    />
                </div>

                <ClubActions
                    clubId={club._id}
                    className="absolute bottom-3 right-3"
                />

                <div className="absolute bottom-3 left-3">
                    <LikesCounter clubId={club._id} />
                </div>
            </div>

            <div className="pt-4">
                <div className="flex justify-between items-start mb-4">
                    <Link href={`/clubs/${club.slug}`} className="block">
                        <Heading
                            level={2}
                            className="text-dark-green font-semibold hover:text-cta-green transition-colors"
                        >
                            {club.title}
                        </Heading>
                    </Link>
                    <span className="text-xs uppercase tracking-wider text-dark-20">
                        {club.aktuellesModell?.name || 'FREE'}
                    </span>
                </div>

                <div className="mb-4">
                    {/* Mobile Tags */}
                    <div className="flex flex-wrap gap-2 lg:hidden">
                        <ClubTagSection
                            club={club}
                            colorScheme="dark-green"
                            onTagClick={onTagClick}
                        />
                        {club.besonderheiten && club.besonderheiten.length > 0 && (
                            <ClubTagArray
                                fieldName="besonderheiten"
                                values={club.besonderheiten}
                                colorScheme="cta-green"
                                onClick={onTagClick}
                            />
                        )}
                    </div>

                    {/* Desktop Tags */}
                    <div className="hidden lg:block space-y-2">
                        <div className="flex flex-wrap gap-2">
                            <ClubTagSection
                                club={club}
                                colorScheme="dark-green"
                                onTagClick={onTagClick}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {club.besonderheiten && club.besonderheiten.length > 0 && (
                                <ClubTagArray
                                    fieldName="besonderheiten"
                                    values={club.besonderheiten}
                                    colorScheme="cta-green"
                                    onClick={onTagClick}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ClubCard;