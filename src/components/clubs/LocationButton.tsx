// src/components/clubs/LocationButton.tsx
import { memo } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import type { LocationButtonProps } from '@/types/ClubComponentTypes';

const LocationButton = memo(function LocationButton({
                                                        city,
                                                        coordinates,
                                                        colorScheme,
                                                        onClick
                                                    }: LocationButtonProps) {
    const colorConfigs = {
        'dark-green': {
            background: 'bg-white',
            text: 'text-dark-green',
            hoverBackground: 'hover:bg-dark-green',
            hoverText: 'hover:text-white',
        }
    };

    const colors = colorConfigs[colorScheme];

    const handleClick = () => {
        onClick('geoFilter', {
            lat: coordinates.lat,
            lng: coordinates.lng,
            radius: 50
        });
    };

    return (
        <button
            onClick={handleClick}
            className={`
                group
                flex 
                items-center 
                gap-1.5 
                px-3 
                py-1.5 
                rounded-full 
                ${colors.background} 
                ${colors.text} 
                ${colors.hoverBackground} 
                transition-colors 
                text-sm 
                font-medium
            `}
        >
            <MapPinIcon
                className={`
                    w-4 
                    h-4 
                    transition-colors 
                    ${colors.text}
                    group-hover:text-white
                `}
            />
            <span className="transition-colors group-hover:text-white">
                {city}
            </span>
        </button>
    );
});

export default LocationButton;