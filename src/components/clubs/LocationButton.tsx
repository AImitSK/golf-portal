import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline'; // Heroicon Icon

interface LocationButtonProps {
    city: string;                      // Name der Stadt
    colorScheme: 'dark-green';         // Aktuell nur ein Farbschema
    onClick: (fieldName: string, value: string) => void; // Funktion beim Klick
}

const LocationButton: React.FC<LocationButtonProps> = ({ city, colorScheme, onClick }) => {
    const colorConfigs = {
        'dark-green': {
            background: 'bg-white',
            text: 'text-dark-green',
            hoverBackground: 'hover:bg-dark-green',
            hoverText: 'hover:text-white', // Hover-Farbe für Text und Icon
        }
    };

    const colors = colorConfigs[colorScheme];

    return (
        <button
            onClick={() => onClick('geoLocation', city)}
            className={`
                group // Definieren einer group für den Button
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
            {/* Heroicon Standort-Icon */}
            <MapPinIcon
                className={`
                    w-4 
                    h-4 
                    transition-colors 
                    ${colors.text} // Icon hat Standardfarbe (dunkelgrün)
                    group-hover:text-white // Icon wird beim Hover weiß
                `}
            />
            {/* Stadtnamen */}
            <span className="transition-colors group-hover:text-white">{city}</span>
        </button>
    );
};

export default LocationButton;