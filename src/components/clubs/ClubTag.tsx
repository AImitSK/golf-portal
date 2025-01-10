import React from 'react';
import { FilterValue } from '@/types/club-types';

type ColorScheme = 'dark-green' | 'cta-green' | 'light-green';

const colorConfigs: Record<ColorScheme, {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}> = {
    'dark-green': {
        background: 'bg-dark-green-10',
        text: 'text-dark-green',
        hoverBackground: 'hover:bg-dark-green',
        hoverText: 'hover:text-white'
    },
    'cta-green': {
        background: 'bg-cta-green-15',
        text: 'text-cta-green',
        hoverBackground: 'hover:bg-cta-green',
        hoverText: 'hover:text-white'
    },
    'light-green': {
        background: 'bg-light-green',
        text: 'text-dark-green',
        hoverBackground: 'hover:bg-light-green-dark',
        hoverText: 'hover:text-dark-green'
    }
};

// Spezifischer Typ für die Tag-Werte
type TagValue = string | number;

interface ClubTagProps {
    fieldName: string;
    value: TagValue;
    colorScheme: ColorScheme;
    prefix?: string;
    suffix?: string;
    onClick: (fieldName: string, value: FilterValue) => void;
}

export const ClubTag: React.FC<ClubTagProps> = ({
                                                    fieldName,
                                                    value,
                                                    colorScheme,
                                                    prefix,
                                                    suffix,
                                                    onClick
                                                }) => {
    const colors = colorConfigs[colorScheme];
    const displayValue = `${prefix ? `${prefix} ` : ''}${value}${suffix ? suffix : ''}`;

    const handleClick = () => {
        // Stelle sicher, dass der übergebene Wert als TagValue behandelt wird
        onClick(fieldName, value as FilterValue);
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
};

interface ClubTagArrayProps {
    fieldName: string;
    values: string[];
    colorScheme: ColorScheme;
    prefix?: string;
    suffix?: string;
    onClick: (fieldName: string, value: FilterValue) => void;
}

export const ClubTagArray: React.FC<ClubTagArrayProps> = ({
                                                              fieldName,
                                                              values,
                                                              colorScheme,
                                                              prefix,
                                                              suffix,
                                                              onClick
                                                          }) => {
    return (
        <>
            {values.map((value, index) => (
                <ClubTag
                    key={`${fieldName}-${index}`}
                    fieldName={fieldName}
                    value={value}
                    colorScheme={colorScheme}
                    prefix={prefix}
                    suffix={suffix}
                    onClick={onClick}
                />
            ))}
        </>
    );
};