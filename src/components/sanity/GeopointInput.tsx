// components/sanity/GeopointInput.tsx
import React from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { set, unset } from 'sanity'
import type { ObjectInputProps } from 'sanity'

interface GeoPoint {
    _type: 'geopoint';
    lat: number;
    lng: number;
    alt?: number;
}

const containerStyle = {
    width: '100%',
    height: '400px'
}

const defaultCenter = {
    lat: 51.1657,
    lng: 10.4515
}

export function GeopointInput(props: ObjectInputProps) {
    const { onChange, value } = props
    const geoValue = value as GeoPoint | undefined

    const [marker, setMarker] = React.useState<GeoPoint | null>(
        geoValue ? {
            _type: 'geopoint',
            lat: geoValue.lat,
            lng: geoValue.lng
        } : null
    )

    const handleMapClick = React.useCallback((e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const newPos: GeoPoint = {
            _type: 'geopoint',
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            alt: 0
        }
        setMarker(newPos)
        onChange(set(newPos))
    }, [onChange])

    const handleMarkerDragEnd = React.useCallback((e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const newPos: GeoPoint = {
            _type: 'geopoint',
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            alt: 0
        }
        setMarker(newPos)
        onChange(set(newPos))
    }, [onChange])

    return (
        <div style={{ padding: '1rem 0' }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={marker || defaultCenter}
                zoom={marker ? 15 : 6}
                onClick={handleMapClick}
            >
                {marker && (
                    <Marker
                        position={marker}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                    />
                )}
            </GoogleMap>
        </div>
    )
}