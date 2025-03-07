// src/components/course-list/Scorecard.tsx
import React, { useState, useEffect } from 'react';
import { calculateCourseHandicap, calculateNetScore, calculateStablefordPoints } from '@/utils/golf-calculations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Tee } from '@/types/golf-course';

interface ScorecardProps {
    tee: Tee;
    playerHandicap: number;
    onSubmit: (data: {
        tee: Tee;
        scores: number[];
        totalGross: number;
        totalNet: number;
        totalStableford: number;
    }) => void;
}

export default function Scorecard({ tee, playerHandicap, onSubmit }: ScorecardProps) {
    const [scores, setScores] = useState<number[]>(new Array(tee.holes.length).fill(0));
    const [courseHandicap, setCourseHandicap] = useState(0);

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
        const total = {
            gross: scores.reduce((sum, score) => sum + score, 0),
            net: 0,
            stableford: 0
        };

        total.net = scores.reduce((sum, score, index) => {
            const netScore = calculateNetScore(
                score,
                courseHandicap,
                tee.holes[index].handicapIndex
            );
            return sum + netScore;
        }, 0);

        total.stableford = scores.reduce((sum, score, index) => {
            const netScore = calculateNetScore(
                score,
                courseHandicap,
                tee.holes[index].handicapIndex
            );
            return sum + calculateStablefordPoints(netScore, tee.holes[index].par);
        }, 0);

        return total;
    };

    const handleSubmit = () => {
        const totals = calculateTotals();
        onSubmit({
            tee,
            scores,
            totalGross: totals.gross,
            totalNet: totals.net,
            totalStableford: totals.stableford
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Scorecard - {tee.name}</span>
                    <div className="flex gap-4 items-center">
                        <span className="text-sm">Course HCP: {courseHandicap}</span>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Runde speichern
                        </button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Loch</th>
                            {tee.holes.map(hole => (
                                <th key={hole.number} className="p-2">{hole.number}</th>
                            ))}
                            <th className="p-2">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="p-2 font-bold">Par</td>
                            {tee.holes.map(hole => (
                                <td key={hole.number} className="p-2 text-center">{hole.par}</td>
                            ))}
                            <td className="p-2 text-center font-bold">{tee.par}</td>
                        </tr>
                        <tr>
                            <td className="p-2 font-bold">HCP</td>
                            {tee.holes.map(hole => (
                                <td key={hole.number} className="p-2 text-center">{hole.handicapIndex}</td>
                            ))}
                            <td className="p-2"></td>
                        </tr>
                        <tr>
                            <td className="p-2 font-bold">Score</td>
                            {scores.map((score, index) => (
                                <td key={index} className="p-2">
                                    <input
                                        type="number"
                                        value={score || ''}
                                        onChange={(e) => handleScoreChange(index, e.target.value)}
                                        className="w-12 text-center border rounded p-1"
                                        min="1"
                                    />
                                </td>
                            ))}
                            <td className="p-2 text-center font-bold">{calculateTotals().gross}</td>
                        </tr>
                        <tr>
                            <td className="p-2 font-bold">Netto</td>
                            {tee.holes.map((hole, index) => {
                                const netScore = calculateNetScore(
                                    scores[index],
                                    courseHandicap,
                                    hole.handicapIndex
                                );
                                return (
                                    <td key={index} className="p-2 text-center">
                                        {scores[index] ? netScore : ''}
                                    </td>
                                );
                            })}
                            <td className="p-2 text-center font-bold">{calculateTotals().net}</td>
                        </tr>
                        <tr>
                            <td className="p-2 font-bold">Stableford</td>
                            {tee.holes.map((hole, index) => {
                                const netScore = calculateNetScore(
                                    scores[index],
                                    courseHandicap,
                                    hole.handicapIndex
                                );
                                const points = scores[index]
                                    ? calculateStablefordPoints(netScore, hole.par)
                                    : '';
                                return (
                                    <td key={index} className="p-2 text-center">{points}</td>
                                );
                            })}
                            <td className="p-2 text-center font-bold">{calculateTotals().stableford}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}