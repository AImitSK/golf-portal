// LikeButton.tsx
'use client';

import React from 'react';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface LikeButtonProps {
    clubId: string;
    className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
                                                          clubId,
                                                          className = '',
                                                      }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Like-Status mit SWR abrufen
    const { data: likeStatus } = useSWR(
        session?.user ? `/api/likes/status?clubId=${clubId}&userId=${session.user._id}` : null,
        fetcher
    );

    const handleLikeClick = async () => {
        if (status === 'loading') return;

        if (!session?.user) {
            router.push('/auth/login');
            return;
        }

        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clubId,
                    userId: session.user._id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Fehler:', data.error);
                return;
            }

            // Sofortige Revalidierung aller relevanten Daten
            await Promise.all([
                mutate(`/api/likes/status?clubId=${clubId}&userId=${session.user._id}`),
                mutate(`/api/likes?clubId=${clubId}`)
            ]);

        } catch (error) {
            console.error('Fehler beim Liken:', error);
        }
    };

    const isLiked = likeStatus?.hasLiked;

    return (
        <button
            onClick={handleLikeClick}
            disabled={status === 'loading'}
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
            title={isLiked ? 'Als Favorit entfernen' : 'Als Favorit markieren'}
        >
            {isLiked ? (
                <SolidHeartIcon className="h-5 w-5 text-white" aria-hidden="true" />
            ) : (
                <HeartIcon className="h-5 w-5 text-white" aria-hidden="true" />
            )}
        </button>
    );
};