// src/components/clubs/ClubMap.tsx
'use client';

import React from 'react';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import type { GolfClub } from '@/types/club-types';

interface ClubMapProps {
    club: GolfClub;
}

const ClubMap: React.FC<ClubMapProps> = ({ club }) => {
    const [isInfoWindowOpen, setIsInfoWindowOpen] = React.useState(true);
    const isLoaded = useGoogleMaps();

    const center = {
        lat: club.adresse?.location?.lat || 0,
        lng: club.adresse?.location?.lng || 0
    };

    const mapContainerStyle = {
        width: '100%',
        height: '500px'
    };

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
    };

    // Formatiere die vollständige Adresse
    const formatAddress = () => {
        const { adresse } = club;
        if (!adresse) return '';
        return `${adresse.strasse}, ${adresse.plz} ${adresse.ort}${adresse.land ? `, ${adresse.land.name}` : ''}`;
    };

    // Erzeugt Google Maps Route URL
    const getGoogleMapsUrl = () => {
        const address = encodeURIComponent(formatAddress());
        return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    };

    if (!isLoaded) {
        return (
            <div
                role="alert"
                aria-busy="true"
                className="w-full h-[500px] rounded-lg bg-dark-green/5 flex items-center justify-center"
            >
                <div className="text-dark-green">Karte wird geladen...</div>
            </div>
        );
    }

    return (
        <div
            className="w-full rounded-lg overflow-hidden shadow-lg"
            role="region"
            aria-label={`Standort von ${club.title}`}
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                options={options}
            >
                <div tabIndex={0} aria-label={`Marker für ${club.title}`}>
                    <MarkerF
                        position={center}
                        onClick={() => setIsInfoWindowOpen(true)}
                    >
                        {isInfoWindowOpen && (
                            <div role="dialog" aria-label="Standort Details">
                                <InfoWindowF
                                    position={center}
                                    onCloseClick={() => setIsInfoWindowOpen(false)}
                                >
                                    <div className="p-2">
                                        <h3 className="font-semibold text-dark-green mb-1">
                                            {club.title}
                                        </h3>
                                        <p className="text-sm text-dark-60 mb-2">
                                            {formatAddress()}
                                        </p>
                                        <a
                                            href={getGoogleMapsUrl()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-cta-green hover:underline focus:outline-none focus:ring-2 focus:ring-cta-green focus:ring-offset-2 rounded-sm"
                                            aria-label="Route zu diesem Standort in Google Maps planen"
                                        >
                                            Route planen
                                        </a>
                                    </div>
                                </InfoWindowF>
                            </div>
                        )}
                    </MarkerF>
                </div>
            </GoogleMap>
        </div>
    );
};

export default ClubMap;