// src/components/clubs/ClubTagArray.tsx
import { memo } from 'react';
import type { ClubTagArrayProps } from '@/types/ClubComponentTypes';
import ClubTag from './ClubTag';  // Default import statt named import

const ClubTagArray = memo(function ClubTagArray({
                                                    fieldName,
                                                    values,
                                                    colorScheme,
                                                    prefix,
                                                    suffix,
                                                    onClick
                                                }: ClubTagArrayProps) {
    if (!values || values.length === 0) return null;

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
});

export default ClubTagArray;