// src/components/clubs/LikeButton.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface LikeButtonProps {
    clubId: string;
    userId?: string;
    className?: string;
    onLikeChange?: (newCount: number) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
                                                          clubId,
                                                          userId,
                                                          className = '',
                                                          onLikeChange
                                                      }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Prüft den initialen Like-Status
    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/likes/status?clubId=${clubId}&userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setIsLiked(data.hasLiked);
                }
            } catch (error) {
                console.error('Error checking like status:', error);
            }
        };

        checkLikeStatus();
    }, [clubId, userId]);

    const handleLikeClick = async () => {
        // Temporär für Test
        const tempUserId = "test-user-id";
        if (!clubId) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clubId,
                    userId: tempUserId // später durch echte userId ersetzen
                }),
            });

            if (response.ok) {
                // Toggle den lokalen Like-Status
                setIsLiked(prevState => !prevState);

                // Hole die aktualisierte Like-Anzahl
                const countResponse = await fetch(`/api/likes?clubId=${clubId}`);
                if (countResponse.ok) {
                    const { count } = await countResponse.json();
                    onLikeChange?.(count);
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLikeClick}
            disabled={isLoading}
            className={`
                flex items-center justify-center h-9 w-9 rounded-full 
                transition-all duration-200
                ${isLiked
                ? 'bg-green-600 hover:bg-green-700'
                : className || 'bg-dark-green hover:bg-dark-green/90'
            }
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            title={isLiked ? "Als Favorit entfernen" : "Als Favorit markieren"}
        >
            <img
                src="/icons/iconLoveWithe.svg"
                alt={isLiked ? "Gefällt mir" : "Gefällt mir nicht"}
                className={`h-5 w-5 transition-transform duration-200 
                    ${isLoading ? 'opacity-50' : ''}
                    ${isLiked ? 'scale-110' : 'scale-100'}
                `}
            />
        </button>
    );
};