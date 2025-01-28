// src/components/course-list/StatsDashboard.tsx
'use client';

import React from 'react';
import type { PlayedTee } from '@/types/golf-round';

interface StatsDashboardProps {
    scores: number[];
    tee: PlayedTee;
    courseHandicap: number;
}

export default function StatsDashboard({ scores, tee, courseHandicap }: StatsDashboardProps) {
    if (!scores || !scores.length) {
        return null;
    }

    const totalRounds = scores.length;
    const averageStableford = Math.round(scores.reduce((sum, score) => sum + score, 0) / totalRounds);
    const bestStableford = Math.max(...scores);

    const StatCard = ({ title, value, subtitle }: { title: string; value: number | string; subtitle?: string }) => (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gesamtstatistik</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Gespielte Runden"
                    value={totalRounds}
                />
                <StatCard
                    title="Durchschnitt Stableford"
                    value={averageStableford}
                    subtitle="Punkte"
                />
                <StatCard
                    title="Beste Runde"
                    value={bestStableford}
                    subtitle="Stableford Punkte"
                />
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Details</h2>
                <p>Tee: {tee.name}</p>
                <p>Course Handicap: {courseHandicap}</p>
            </div>
        </div>
    );
}