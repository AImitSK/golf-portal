// src/components/course-list/RoundsList.tsx
'use client';

import React from 'react';
import { formatDate } from '@/lib/utils';
import DeleteRoundButton from '@/components/course-list/DeleteRoundButton';
import type { Round } from '@/types/round';

interface RoundsListProps {
    rounds: Round[];
    onRoundDelete?: (roundId: string, playKey: string) => void;
}

export default function RoundsList({ rounds, onRoundDelete }: RoundsListProps) {
    const flattenedRounds = rounds.flatMap(round =>
        round.plays.map(play => ({
            roundId: round._id,
            playKey: play._key,
            clubName: round.club.title,
            date: play.date,
            score: play.score,
            notiz: play.notiz,
            wetter: play.wetter
        }))
    );

    const handleDelete = (roundId: string, playKey: string) => {
        onRoundDelete?.(roundId, playKey);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="p-3 text-left">Datum</th>
                    <th className="p-3 text-left">Platz</th>
                    <th className="p-3 text-right">Score</th>
                    <th className="p-3 text-left">Wetter</th>
                    <th className="p-3 text-left">Notiz</th>
                    <th className="p-3"></th>
                </tr>
                </thead>
                <tbody>
                {flattenedRounds.map((round) => (
                    <tr
                        key={round.playKey}
                        className="border-b hover:bg-gray-50"
                    >
                        <td className="p-3">{formatDate(round.date)}</td>
                        <td className="p-3">{round.clubName}</td>
                        <td className="p-3 text-right">{round.score}</td>
                        <td className="p-3">{round.wetter || '-'}</td>
                        <td className="p-3">{round.notiz || '-'}</td>
                        <td className="p-3">
                            <DeleteRoundButton
                                roundId={round.roundId}
                                playKey={round.playKey}
                                onDelete={() => handleDelete(round.roundId, round.playKey)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}