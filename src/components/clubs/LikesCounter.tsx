'use client';

import React, { useEffect, useState } from 'react';
import { HandThumbUpIcon } from '@heroicons/react/24/outline'; // Outline-Version
import { HandThumbUpIcon as SolidHandThumbUpIcon } from '@heroicons/react/24/solid'; // Gefüllte Version

interface LikesCounterProps {
    clubId: string;
}

export const LikesCounter: React.FC<LikesCounterProps> = ({ clubId }) => {
    const [count, setCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Likes für den Club laden
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
                <HandThumbUpIcon className="w-4 h-4 text-dark-green" aria-hidden="true" />
                <span className="text-sm font-medium text-dark-green">
                    Lädt...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 w-fit bg-red-100">
                <HandThumbUpIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
                <span className="text-sm font-medium text-red-500">
                    Fehler
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 w-fit">
            <SolidHandThumbUpIcon className="w-4 h-4 text-dark-green" aria-hidden="true" />
            <span className="text-sm font-medium text-dark-green">
                {count.toLocaleString()}
            </span>
        </div>
    );
};