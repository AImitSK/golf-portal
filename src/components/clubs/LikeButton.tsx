// src/components/clubs/LikeButton.tsx
'use client';

import React, { useState } from 'react';

interface LikeButtonProps {
    clubId: string;
    className?: string;
    onLikeChange?: (newCount: number) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
                                                          clubId,
                                                          className = '',
                                                          onLikeChange
                                                      }) => {
    // Temporäre feste Benutzer-ID für Tests
    const tempUserId = 'test-user-001';

    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLikeClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clubId,
                    userId: tempUserId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Fehler aus der Antwort extrahieren
                const errorMessage = data.error || 'Unbekannter Fehler';
                console.error('Like Fehler:', errorMessage);
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            // Toggle lokalen Like-Status basierend auf der Antwort
            setIsLiked(data.action === 'added');

            // Aktuelle Like-Anzahl abrufen
            const countResponse = await fetch(`/api/likes?clubId=${clubId}`);
            if (countResponse.ok) {
                const { count } = await countResponse.json();
                onLikeChange?.(count);
            }
        } catch (error) {
            console.error('Fehler beim Liken:', error);
            setError(error instanceof Error ? error.message : 'Fehler beim Liken');
        } finally {
            setIsLoading(false);
        }
    };

    // Fehler-Rendering
    if (error) {
        return (
            <div
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => setError(null)}
            >
                {error}
            </div>
        );
    }

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