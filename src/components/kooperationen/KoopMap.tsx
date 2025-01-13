'use client';
// src/components/kooperationen/KoopMap.tsx
import React from 'react';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface Club {
    title: string;
    slug: string;
    adresse: {
        strasse: string;
        hausnummer: string;
        plz: number;
        ort: string;
        location: {
            lat: number;
            lng: number;
        };
    };
}

interface KoopMapProps {
    clubs: Club[];
    kooperationName: string;
}

const KoopMap: React.FC<KoopMapProps> = ({ clubs, kooperationName }) => {
    const [selectedClub, setSelectedClub] = React.useState<Club | null>(null);
    const isLoaded = useGoogleMaps();

    // Berechne den Mittelpunkt und Zoom basierend auf allen Club-Standorten
    const getMapBounds = () => {
        if (!clubs || clubs.length === 0) return null;

        const bounds = new google.maps.LatLngBounds();
        clubs.forEach(club => {
            bounds.extend({
                lat: club.adresse.location.lat,
                lng: club.adresse.location.lng
            });
        });

        return bounds;
    };

    // Formatiere die Adresse für einen Club
    const formatAddress = (club: Club) => {
        const { adresse } = club;
        return `${adresse.strasse} ${adresse.hausnummer}, ${adresse.plz} ${adresse.ort}`;
    };

    // Erzeugt Google Maps Route URL
    const getGoogleMapsUrl = (club: Club) => {
        const address = encodeURIComponent(formatAddress(club));
        return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    };

    const mapContainerStyle = {
        width: '100%',
        height: '500px'
    };

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
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
            aria-label={`Standorte der ${kooperationName} Partner`}
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                options={options}
                onLoad={(map) => {
                    const bounds = getMapBounds();
                    if (bounds) {
                        map.fitBounds(bounds);
                    }
                }}
            >
                {clubs.map((club) => (
                    <div key={club.slug} tabIndex={0} aria-label={`Marker für ${club.title}`}>
                        <MarkerF
                            position={{
                                lat: club.adresse.location.lat,
                                lng: club.adresse.location.lng
                            }}
                            onClick={() => setSelectedClub(club)}
                        />

                        {selectedClub?.slug === club.slug && (
                            <InfoWindowF
                                position={{
                                    lat: club.adresse.location.lat,
                                    lng: club.adresse.location.lng
                                }}
                                onCloseClick={() => setSelectedClub(null)}
                            >
                                <div className="p-2">
                                    <h3 className="font-semibold text-dark-green mb-1">
                                        {club.title}
                                    </h3>
                                    <p className="text-sm text-dark-60 mb-2">
                                        {formatAddress(club)}
                                    </p>
                                    <div className="flex gap-2">
                                        <a
                                            href={`/clubs/${club.slug}`}
                                            className="text-sm text-cta-green hover:underline focus:outline-none focus:ring-2 focus:ring-cta-green focus:ring-offset-2 rounded-sm"
                                        >
                                            Zum Club
                                        </a>
                                        <a
                                            href={getGoogleMapsUrl(club)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-cta-green hover:underline focus:outline-none focus:ring-2 focus:ring-cta-green focus:ring-offset-2 rounded-sm"
                                        >
                                            Route planen
                                        </a>
                                    </div>
                                </div>
                            </InfoWindowF>
                        )}
                    </div>
                ))}
            </GoogleMap>
        </div>
    );
};

export default KoopMap;