// src/components/course-list/RoundDetail.tsx
import React from 'react';
import type { PlayedRound } from '@/types/played-round';

interface RoundDetailProps {
    round: PlayedRound;
}

export default function RoundDetail({ round }: RoundDetailProps) {
    return (
        <div className="p-6">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h3 className="font-medium">Abschlag</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: round.playedTee.color }}
                        />
                        {round.playedTee.name}
                    </div>
                </div>
                <div>
                    <h3 className="font-medium">Wetter</h3>
                    <p className="mt-1">{round.weather || '-'}</p>
                </div>
                <div>
                    <h3 className="font-medium">Notizen</h3>
                    <p className="mt-1">{round.notes || '-'}</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="p-2 text-left">Loch</th>
                        {round.holeScores.map((hole) => (
                            <th key={hole.number} className="p-2 text-center">{hole.number}</th>
                        ))}
                        <th className="p-2 text-center">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b">
                        <td className="p-2 font-medium">Par</td>
                        {round.holeScores.map((hole) => (
                            <td key={hole.number} className="p-2 text-center">{hole.par}</td>
                        ))}
                        <td className="p-2 text-center font-medium">
                            {round.holeScores.reduce((sum, hole) => sum + hole.par, 0)}
                        </td>
                    </tr>
                    <tr className="border-b">
                        <td className="p-2 font-medium">Score</td>
                        {round.holeScores.map((hole) => (
                            <td key={hole.number} className="p-2 text-center">{hole.score}</td>
                        ))}
                        <td className="p-2 text-center font-medium">{round.totals.gross}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="p-2 font-medium">Netto</td>
                        {round.holeScores.map((hole) => (
                            <td key={hole.number} className="p-2 text-center">{hole.netScore}</td>
                        ))}
                        <td className="p-2 text-center font-medium">{round.totals.net}</td>
                    </tr>
                    <tr>
                        <td className="p-2 font-medium">Stableford</td>
                        {round.holeScores.map((hole) => (
                            <td key={hole.number} className="p-2 text-center">{hole.stableford}</td>
                        ))}
                        <td className="p-2 text-center font-medium">{round.totals.stableford}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}