// LikesCounter.tsx
'use client';

import React from 'react';
import useSWR from 'swr';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as SolidHandThumbUpIcon } from '@heroicons/react/24/solid';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface LikesCounterProps {
    clubId: string;
}

export const LikesCounter: React.FC<LikesCounterProps> = ({ clubId }) => {
    const { data, error, isLoading } = useSWR(
        `/api/likes?clubId=${clubId}`,
        fetcher,
        {
            refreshInterval: 1000,
            revalidateOnFocus: true
        }
    );

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
                {(data?.count || 0).toLocaleString()}
            </span>
        </div>
    );
};