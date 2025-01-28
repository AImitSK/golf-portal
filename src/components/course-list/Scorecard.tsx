// src/components/course-list/Scorecard.tsx
import React, { useState, useEffect } from 'react';
import { calculateCourseHandicap, calculateNetScore, calculateStablefordPoints } from '@/utils/golf-calculations';
import type { PlayedTee, WeatherType, ScoreInputData } from '@/types/golf-round';
import StatsDashboard from './StatsDashboard';

interface ScorecardProps {
    tee: PlayedTee;
    playerHandicap: number;
    courseId: string;
    onSubmit: (data: ScoreInputData) => Promise<void>; // Hier explizit Promise<void>
}

export default function Scorecard({ tee, playerHandicap, courseId, onSubmit }: ScorecardProps) {
    // Anzahl der Löcher dynamisch aus dem Tee ermitteln
    const numberOfHoles = tee?.holes?.length || 0;
    const [scores, setScores] = useState<number[]>(new Array(numberOfHoles).fill(0));
    const [courseHandicap, setCourseHandicap] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [weather, setWeather] = useState<WeatherType | undefined>();
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (tee && playerHandicap) {
            const chp = calculateCourseHandicap({
                handicapIndex: playerHandicap,
                slopeRating: tee.slopeRating,
                courseRating: tee.courseRating,
                par: tee.par
            });
            setCourseHandicap(chp);
        }
    }, [playerHandicap, tee]);

    const handleScoreChange = (index: number, value: string) => {
        const newScores = [...scores];
        newScores[index] = parseInt(value) || 0;
        setScores(newScores);
    };

    const calculateTotals = () => {
        if (!tee?.holes) {
            return { gross: 0, net: 0, stableford: 0 };
        }

        // Nur die tatsächlich gespielten Löcher berechnen
        const gross = scores.slice(0, numberOfHoles).reduce((sum, score) => sum + (score || 0), 0);
        const net = tee.holes.reduce((sum, hole, index) => {
            if (index >= numberOfHoles || !scores[index]) return sum;
            const netScore = calculateNetScore(
                scores[index],
                courseHandicap,
                hole.handicapIndex || 0
            );
            return sum + netScore;
        }, 0);
        const stableford = tee.holes.reduce((sum, hole, index) => {
            if (index >= numberOfHoles || !scores[index]) return sum;
            const netScore = calculateNetScore(
                scores[index],
                courseHandicap,
                hole.handicapIndex || 0
            );
            return sum + calculateStablefordPoints(netScore, hole.par);
        }, 0);

        return { gross, net, stableford };
    };

    const handleSubmit = async () => {
        if (!tee?.holes) return;

        const totals = calculateTotals();
        try {
            await onSubmit({
                courseId,
                playerHandicap,
                tee,
                scores: scores.slice(0, numberOfHoles),
                totalGross: totals.gross,
                totalNet: totals.net,
                totalStableford: totals.stableford,
                date,
                weather,
                notes
            });
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            throw error;
        }
    };

    const weatherOptions = [
        { label: 'Sonnig', value: 'sunny' },
        { label: 'Bewölkt', value: 'cloudy' },
        { label: 'Regnerisch', value: 'rainy' },
        { label: 'Windig', value: 'windy' }
    ];

    if (!tee?.holes) {
        return <div className="p-4">Lade Tee-Daten...</div>;
    }

    return (
        <div className="space-y-8">
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
                                    setWeather(e.target.value as WeatherType)}
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

                    {/* Scorecard Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 border">Loch</th>
                                {tee.holes.map(hole => (
                                    <th key={hole.number} className="p-2 border">{hole.number}</th>
                                ))}
                                <th className="p-2 border">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="p-2 border font-medium">Par</td>
                                {tee.holes.map(hole => (
                                    <td key={hole.number} className="p-2 border text-center">
                                        {hole.par}
                                    </td>
                                ))}
                                <td className="p-2 border text-center font-medium">
                                    {tee.par}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-medium">HCP</td>
                                {tee.holes.map(hole => (
                                    <td key={hole.number} className="p-2 border text-center">
                                        {hole.handicapIndex}
                                    </td>
                                ))}
                                <td className="p-2 border"></td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-medium">Score</td>
                                {tee.holes.map((_, index) => (
                                    <td key={index} className="p-2 border">
                                        <input
                                            type="number"
                                            value={scores[index] || ''}
                                            onChange={(e) => handleScoreChange(index, e.target.value)}
                                            className="w-full text-center border rounded p-1"
                                            min="1"
                                        />
                                    </td>
                                ))}
                                <td className="p-2 border text-center font-medium">
                                    {calculateTotals().gross}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-medium">Netto</td>
                                {tee.holes.map((hole, index) => {
                                    const netScore = scores[index] ? calculateNetScore(
                                        scores[index],
                                        courseHandicap,
                                        hole.handicapIndex
                                    ) : '';
                                    return (
                                        <td key={index} className="p-2 border text-center">
                                            {netScore}
                                        </td>
                                    );
                                })}
                                <td className="p-2 border text-center font-medium">
                                    {calculateTotals().net}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-medium">Stableford</td>
                                {tee.holes.map((hole, index) => {
                                    if (!scores[index]) return <td key={index} className="p-2 border text-center"></td>;

                                    const netScore = calculateNetScore(
                                        scores[index],
                                        courseHandicap,
                                        hole.handicapIndex
                                    );
                                    const points = calculateStablefordPoints(netScore, hole.par);
                                    return (
                                        <td key={index} className="p-2 border text-center">
                                            {points}
                                        </td>
                                    );
                                })}
                                <td className="p-2 border text-center font-medium">
                                    {calculateTotals().stableford}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Stats Dashboard */}
                    {scores.some(score => score > 0) && (
                        <div className="mt-8">
                            <StatsDashboard
                                scores={scores}
                                tee={tee}
                                courseHandicap={courseHandicap}
                            />
                        </div>
                    )}

                    {/* Notizen */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Notizen</label>
                        <textarea
                            value={notes}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                            placeholder="Notizen zur Runde..."
                            className="w-full p-2 border rounded"
                            rows={3}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Runde speichern
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}