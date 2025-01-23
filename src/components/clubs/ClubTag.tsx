// src/components/clubs/ClubTag.tsx
import { memo } from 'react';
import type { ClubTagProps } from '@/types/ClubComponentTypes';
import { colorConfigs } from '@/types/ClubComponentTypes';  // Regular import für den Wert

const ClubTag = memo(function ClubTag({
                                          fieldName,
                                          value,
                                          colorScheme,
                                          prefix,
                                          suffix,
                                          onClick
                                      }: ClubTagProps) {
    const colors = colorConfigs[colorScheme];
    const displayValue = `${prefix ? `${prefix} ` : ''}${value}${suffix ? suffix : ''}`;

    const handleClick = () => {
        onClick(fieldName, value);
    };

    return (
        <button
            onClick={handleClick}
            className={`
                px-3 
                py-1 
                rounded-full 
                text-sm 
                font-medium 
                transition-colors 
                ${colors.background} 
                ${colors.text}
                ${colors.hoverBackground}
                ${colors.hoverText}
            `}
        >
            {displayValue}
        </button>
    );
});

export default ClubTag;