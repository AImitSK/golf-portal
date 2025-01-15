// src/components/clubs/LikesCounter.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface LikesCounterProps {
    clubId: string;
}

export const LikesCounter: React.FC<LikesCounterProps> = ({ clubId }) => {
    const [count, setCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/likes?clubId=${clubId}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Fehler beim Laden der Likes');
                }

                const data = await response.json();
                setCount(data.count || 0);
                setError(null);
            } catch (error) {
                console.error('Fehler beim Laden der Likes:', error);
                setError(error instanceof Error ? error.message : 'Unbekannter Fehler');
                setCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLikes();
    }, [clubId]);

    if (isLoading) {
        return (
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 w-fit opacity-50">
                <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4"/>
                <span className="text-sm font-medium text-dark-green">
                    Lädt...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 w-fit bg-red-100">
                <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4"/>
                <span className="text-sm font-medium text-red-500">
                    Fehler
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 w-fit">
            <img src="/icons/iconLikeDarkGreen.svg" alt="Likes" className="w-4 h-4"/>
            <span className="text-sm font-medium text-dark-green">
                {count.toLocaleString()}
            </span>
        </div>
    );
};