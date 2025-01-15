// src/components/clubs/LikesCounter.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface LikesCounterProps {
    clubId: string;
}

export const LikesCounter: React.FC<LikesCounterProps> = ({ clubId }) => {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await fetch(`/api/likes?clubId=${clubId}`);
                const data = await response.json();
                setCount(data.count);
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchLikes();
    }, [clubId]);

    return (
        <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 w-fit">
            <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4"/>
            <span className="text-sm font-medium text-dark-green">
                {count.toLocaleString()}
            </span>
        </div>
    );
};