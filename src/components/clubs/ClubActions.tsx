// src/components/clubs/ClubActions.tsx
import { memo } from 'react';
import type { ClubActionsProps } from '@/types/ClubComponentTypes';
import { LikeButton } from './LikeButton';
import GridNavi from '@/components/frontend-ui/GridNavi';
import ClubImage from './ClubImage';

const ClubActions = memo(function ClubActions({ clubId, className }: ClubActionsProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                className="flex items-center justify-center h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 transition-colors"
                aria-label="Teilen"
            >
                <ClubImage
                    src="/icons/iconShareWithe.svg"
                    alt=""
                    className="h-5 w-5"
                    aria-hidden="true"
                />
            </button>
            <LikeButton
                clubId={clubId}
                className="bg-black/30 hover:bg-black/40"
            />
            <div className="relative flex items-center justify-center h-9 w-9 rounded-full overflow-visible z-10">
                <GridNavi clubId={clubId} />
            </div>
        </div>
    );
});

export default ClubActions;