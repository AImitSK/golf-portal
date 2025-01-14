// src/components/clubs/LikesCounter.tsx
'use client';

import React from 'react';

interface LikesCounterProps {
    count: number;
}

export const LikesCounter: React.FC<LikesCounterProps> = ({ count }) => {
    return (
        <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 w-fit">
            <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4"/>
            <span className="text-sm font-medium text-dark-green">
                {count.toLocaleString()}
            </span>
        </div>
    );
};