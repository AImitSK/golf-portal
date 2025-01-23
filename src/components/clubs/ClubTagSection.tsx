// src/components/clubs/ClubTagSection.tsx
import { memo, useCallback } from 'react';
import type { ColorScheme } from '@/types/ClubComponentTypes';
import type { GolfClub, FilterValue } from '@/types/club-types';
import ClubTag from './ClubTag';

interface ClubTagSectionProps {
    club: GolfClub;
    colorScheme: ColorScheme;
    onTagClick: (fieldName: string, value: FilterValue) => void;
}

const ClubTagSection = memo(function ClubTagSection({
                                                        club,
                                                        colorScheme,
                                                        onTagClick
                                                    }: ClubTagSectionProps) {
    const renderTag = useCallback((
        fieldName: string,
        value: string | number | undefined,
        colorScheme: ColorScheme,
        prefix?: string,
        suffix?: string
    ) => {
        if (value == null) return null;
        return (
            <ClubTag
                fieldName={fieldName}
                value={value}
                colorScheme={colorScheme}
                prefix={prefix}
                suffix={suffix}
                onClick={onTagClick}
            />
        );
    }, [onTagClick, colorScheme]);

    return (
        <>
            {renderTag('anzahlLoecher', club.anzahlLoecher, colorScheme, undefined, ' Loch')}
            {renderTag('parGesamt', club.parGesamt, colorScheme, 'Par')}
            {renderTag('laengeMeter', club.laengeMeter, colorScheme, undefined, 'm')}
            {renderTag('handicapBeschraenkung', club.handicapBeschraenkung, colorScheme, 'HCP')}
            {renderTag('courseRating', club.courseRating, colorScheme, 'CR')}
            {renderTag('slope', club.slope, colorScheme, 'Slope')}
        </>
    );
});

export default ClubTagSection;