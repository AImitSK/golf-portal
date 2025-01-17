// src/components/clubs/LikeButton.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Prüfe initial, ob der User den Club bereits geliked hat
    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!session?.user?._id) return;

            try {
                const response = await fetch(`/api/likes/status?clubId=${clubId}&userId=${session.user._id}`);
                if (response.ok) {
                    const { hasLiked } = await response.json();
                    setIsLiked(hasLiked);
                }
            } catch (error) {
                console.error('Fehler beim Prüfen des Like-Status:', error);
            }
        };

        if (status === 'authenticated') {
            checkLikeStatus();
        }
    }, [clubId, session?.user?._id, status]);

    const handleLikeClick = async () => {
        if (isLoading) return;

        // Wenn nicht eingeloggt, zur Login-Seite weiterleiten
        if (!session?.user) {
            router.push('/auth/login');
            return;
        }

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
                    userId: session.user._id
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error || 'Unbekannter Fehler';
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            // Toggle lokalen Like-Status
            setIsLiked(data.action === 'added');

            // Aktualisiere Like-Zähler
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

    return (
        <button
            onClick={handleLikeClick}
            disabled={isLoading || status === 'loading'}
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