// src/components/course-list/Scorecard.tsx
import React, { useState, useEffect } from 'react';
import { calculateCourseHandicap, calculateNetScore, calculateStablefordPoints } from '@/utils/golf-calculations';
import type { Tee, TeeColor } from '@/types/golf-course';

interface ScoreSubmissionData {
    courseId: string;
    playerHandicap: number;
    date: string;
    tee: {
        name: string;
        color: TeeColor;
        gender: string;
        courseRating: number;
        slopeRating: number;
        par: number;
        holes: Array<{
            number: number;
            par: number;
            handicapIndex: number;
            length?: number;
            courseHCP?: number;
        }>;
    };
    scores: number[];
    totalGross: number;
    totalNet: number;
    totalStableford: number;
    weather?: 'sunny' | 'cloudy' | 'rainy' | 'windy';
    notes?: string;
}

interface ScorecardProps {
    tee: Tee;
    playerHandicap: number;
    onSubmit: (data: Omit<ScoreSubmissionData, 'courseId' | 'playerHandicap'>) => void;
}

export default function Scorecard({ tee, playerHandicap, onSubmit }: ScorecardProps) {
    const [scores, setScores] = useState<number[]>(new Array(18).fill(0));
    const [courseHandicap, setCourseHandicap] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy' | 'windy' | undefined>();
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const chp = calculateCourseHandicap({
            handicapIndex: playerHandicap,
            slopeRating: tee.slopeRating,
            courseRating: tee.courseRating,
            par: tee.par
        });
        setCourseHandicap(chp);
    }, [playerHandicap, tee]);

    const handleScoreChange = (index: number, value: string) => {
        const newScores = [...scores];
        newScores[index] = parseInt(value) || 0;
        setScores(newScores);
    };

    const calculateTotals = () => {
        const gross = scores.reduce((sum, score) => sum + (score || 0), 0);
        const net = tee.holes.reduce((sum, hole, index) => {
            if (!scores[index]) return sum;
            const netScore = calculateNetScore(
                scores[index],
                courseHandicap,
                hole.handicapIndex
            );
            return sum + netScore;
        }, 0);
        const stableford = tee.holes.reduce((sum, hole, index) => {
            if (!scores[index]) return sum;
            const netScore = calculateNetScore(
                scores[index],
                courseHandicap,
                hole.handicapIndex
            );
            return sum + calculateStablefordPoints(netScore, hole.par);
        }, 0);

        return { gross, net, stableford };
    };

    const handleSubmit = () => {
        const totals = calculateTotals();
        onSubmit({
            tee: {
                name: tee.name,
                color: tee.color,
                gender: tee.gender,
                courseRating: tee.courseRating,
                slopeRating: tee.slopeRating,
                par: tee.par,
                holes: tee.holes.map((hole, index) => ({
                    number: index + 1,
                    par: hole.par,
                    handicapIndex: hole.handicapIndex,
                    length: hole.length,
                    courseHCP: hole.courseHCP
                }))
            },
            scores,
            totalGross: totals.gross,
            totalNet: totals.net,
            totalStableford: totals.stableford,
            date,
            weather,
            notes
        });
    };

    const weatherOptions = [
        { label: 'Sonnig', value: 'sunny' },
        { label: 'Bewölkt', value: 'cloudy' },
        { label: 'Regnerisch', value: 'rainy' },
        { label: 'Windig', value: 'windy' }
    ];

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Scorecard - {tee.name}</h2>
                    <div className="text-sm">Course HCP: {courseHandicap}</div>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Datum Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Datum</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Wetter Select */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Wetter</label>
                        <select
                            value={weather}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setWeather(e.target.value as typeof weather)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Wetter auswählen</option>
                            {weatherOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Rest der Komponente bleibt gleich... */}
            </div>
        </div>
    );
}