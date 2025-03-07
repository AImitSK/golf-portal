// src/components/course-list/StatsDashboard.tsx
'use client';

import React from 'react';
import { calculateRoundStats } from '@/utils/golf-calculations';
import type { PlayedTee } from '@/types/golf-round';

interface StatsDashboardProps {
    scores: number[];
    tee: PlayedTee;
    courseHandicap: number;
}

export default function StatsDashboard({ scores, tee, courseHandicap }: StatsDashboardProps) {
    // Frühe Rückgabe, wenn keine gültigen Daten vorhanden sind
    if (!tee || !tee.holes || !Array.isArray(tee.holes)) {
        return null;
    }

    const pars = tee.holes.map(hole => hole.par);
    const holeHandicaps = tee.holes.map(hole => hole.handicapIndex);

    // Sicherstellen, dass alle erforderlichen Daten vorhanden sind
    if (!pars.length || !holeHandicaps.length || !scores.length) {
        return null;
    }

    const stats = calculateRoundStats(scores, pars, courseHandicap, holeHandicaps);

    const StatCard = ({ title, value, subtitle }: { title: string; value: number | string; subtitle?: string }) => (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Rundenstatistik</h2>

            {/* Hauptwerte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Brutto"
                    value={stats.totalGross}
                    subtitle={`Über Par: ${stats.totalGross - tee.par}`}
                />
                <StatCard
                    title="Netto"
                    value={stats.totalNet}
                    subtitle={`Über Par: ${stats.totalNet - tee.par}`}
                />
                <StatCard
                    title="Stableford"
                    value={stats.totalStableford}
                    subtitle="Punkte"
                />
            </div>

            {/* Detaillierte Statistiken */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Birdies oder besser"
                    value={stats.birdiesOrBetter}
                />
                <StatCard
                    title="Pars"
                    value={stats.pars}
                />
                <StatCard
                    title="Bogeys"
                    value={stats.bogeys}
                />
                <StatCard
                    title="Double Bogey+"
                    value={stats.doubleBogeyOrWorse}
                />
            </div>

            {/* Zusätzliche Informationen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500">Platzdaten</h3>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm">Course Rating: {tee.courseRating}</p>
                        <p className="text-sm">Slope Rating: {tee.slopeRating}</p>
                        <p className="text-sm">Par: {tee.par}</p>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500">Handicap</h3>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm">Course Handicap: {courseHandicap}</p>
                        <p className="text-sm">Playing Handicap: {Math.round(courseHandicap * 0.95)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}