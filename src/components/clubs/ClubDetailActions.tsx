'use client';

import React, { useState } from 'react';
import GridNavi from "@/components/frontend-ui/GridNavi";
import { LikeButton } from './LikeButton';

interface ClubDetailActionsProps {
    clubId: string;
}

export const ClubDetailActions: React.FC<ClubDetailActionsProps> = ({ clubId }) => {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setShowCopiedMessage(true);
            setTimeout(() => {
                setShowCopiedMessage(false);
            }, 2000);
        });
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <button
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-dark-green text-white hover:bg-dark-green/90 transition-colors"
                    onClick={copyToClipboard}
                >
                    <img src="/icons/iconShareWithe.svg" alt="Teilen" className="h-5 w-5" />
                </button>
                {showCopiedMessage && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
                        Link kopiert!
                    </div>
                )}
            </div>
            <LikeButton clubId={clubId} />
            <div className="relative flex items-center justify-center h-9 w-9">
                <GridNavi clubId={clubId} />
            </div>
        </div>
    );
};