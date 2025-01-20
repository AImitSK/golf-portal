import { memo } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline'; // Heroicons verwenden
import type { ClubActionsProps } from '@/types/ClubComponentTypes';
import { LikeButton } from './LikeButton';
import GridNavi from '@/components/frontend-ui/GridNavi';

const ClubActions = memo(function ClubActions({ clubId, className }: ClubActionsProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                className="flex items-center justify-center h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 transition-colors"
                aria-label="Teilen"
            >
                <ShareIcon
                    className="h-5 w-5 text-white"
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