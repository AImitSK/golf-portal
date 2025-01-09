// src/components/clubs/ClubTag.tsx
import React from 'react';

// Definiere mögliche Farbschemata
type ColorScheme = 'dark-green' | 'cta-green' | 'light-green';

// Farbkonfigurationen
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

interface ClubTagProps {
    fieldName: string;           // Name des Feldes im Filter (z.B. 'anzahlLoecher')
    value: string | number;      // Anzuzeigender Wert
    colorScheme: ColorScheme;    // Farbschema
    prefix?: string;            // Optionaler Prefix (z.B. "Par" für "Par 72")
    suffix?: string;            // Optionaler Suffix (z.B. "m" für "6000m")
    onClick: (fieldName: string, value: string | number) => void;
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

    return (
        <button
            onClick={() => onClick(fieldName, value)}
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

// Array-Version der Tag-Komponente
interface ClubTagArrayProps extends Omit<ClubTagProps, 'value'> {
    values: string[];
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