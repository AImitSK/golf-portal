// src/components/clubs/EnhancedClubCard.tsx
import { memo } from 'react';
import type { ClubCardProps } from '@/types/ClubComponentTypes';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { ClubCard } from './ClubCard';

const ClubCardErrorFallback = memo(function ClubCardErrorFallback() {
    return (
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-gray-600 text-sm">
                Diese Golfclub-Karte konnte nicht geladen werden.
            </p>
        </div>
    );
});

export const EnhancedClubCard = memo(function EnhancedClubCard(props: ClubCardProps) {
    return (
        <ErrorBoundary fallback={<ClubCardErrorFallback />}>
            <ClubCard {...props} />
        </ErrorBoundary>
    );
});