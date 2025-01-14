"use client";

import React, { useState, useEffect } from 'react';
import { getGolfClubs } from '@/lib/sanity/getGolfClubs';
import { getKooperation } from '@/lib/sanity/GetKooperation';

export default function PlatformStats() {
    const [golfClubCount, setGolfClubCount] = useState(0);
    const [kooperationenCount, setKooperationenCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [clubs, kooperationen] = await Promise.all([
                    getGolfClubs(),
                    getKooperation()
                ]);

                setGolfClubCount(clubs.length);
                setKooperationenCount(kooperationen.length);
            } catch (error) {
                console.error('Fehler beim Laden der Statistiken:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    const stats = [
        {
            id: 1,
            name: 'Eingetragene Golfplätze',
            value: isLoading ? '...' : golfClubCount.toLocaleString()
        },
        {
            id: 2,
            name: 'Kooperationen und Verbunde',
            value: isLoading ? '...' : kooperationenCount.toLocaleString()
        },
        {
            id: 3,
            name: 'Besucher am Tag',
            value: '1.200'
        },
        {
            id: 4,
            name: 'Angemeldete User',
            value: '3.600'
        }
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="text-center">
                        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                            Deutschlands Golfplatz-Plattform
                        </h2>
                        <p className="mt-4 text-lg/8 text-gray-600">
                            Wir verbinden Golfer mit ihren Lieblingsclubs und Kooperationen
                        </p>
                    </div>
                    <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                                <dt className="text-sm/6 font-semibold text-gray-600">{stat.name}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}