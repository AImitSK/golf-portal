'use client';

import React from 'react';
import { GoogleMap, MarkerF, CircleF } from '@react-google-maps/api';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import type { GolfClub, GeoFilterValue } from '@/types/club-types';

interface FilterMapPreviewProps {
    clubs: GolfClub[];
    geoFilter?: GeoFilterValue;
}

export const FilterMapPreview: React.FC<FilterMapPreviewProps> = ({ clubs, geoFilter }) => {
    const isLoaded = useGoogleMaps();

    const mapContainerStyle = {
        width: '100%',
        height: '300px'
    };

    // Zentriere die Karte auf Deutschland wenn kein geoFilter aktiv ist
    const defaultCenter = { lat: 51.1657, lng: 10.4515 };
    const center = geoFilter ? { lat: geoFilter.lat, lng: geoFilter.lng } : defaultCenter;

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-[300px] rounded-lg bg-dark-green/5 flex items-center justify-center">
                <div className="text-dark-green">Karte wird geladen...</div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-lg overflow-hidden shadow-sm">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={geoFilter ? 9 : 6}
                options={options}
            >
                {clubs.map(club => (
                    <MarkerF
                        key={club.slug}
                        position={{
                            lat: club.adresse?.location?.lat || 0,
                            lng: club.adresse?.location?.lng || 0
                        }}
                    />
                ))}

                {geoFilter && (
                    <CircleF
                        center={{ lat: geoFilter.lat, lng: geoFilter.lng }}
                        radius={geoFilter.radius * 1000}
                        options={{
                            fillColor: "#00ff00",
                            fillOpacity: 0.1,
                            strokeColor: "#00ff00",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
};