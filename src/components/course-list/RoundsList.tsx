'use client';

import React from 'react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import DeleteRoundButton from '@/components/course-list/DeleteRoundButton';

interface Round {
    _id: string;
    date: string;
    course: {
        _id: string;
        name?: string;
    };
    playedTee?: {
        name?: string;
        color?: string;
    };
    totals?: {
        gross?: number;
        net?: number;
        stableford?: number;
    };
}

interface RoundsListProps {
    rounds: Round[];
}

export default function RoundsList({ rounds }: RoundsListProps) {
    const router = useRouter();

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="p-3 text-left">Datum</th>
                    <th className="p-3 text-left">Platz</th>
                    <th className="p-3 text-left">Abschlag</th>
                    <th className="p-3 text-right">Brutto</th>
                    <th className="p-3 text-right">Netto</th>
                    <th className="p-3 text-right">Stableford</th>
                    <th className="p-3"></th>
                </tr>
                </thead>
                <tbody>
                {rounds.map((round) => (
                    <tr
                        key={round._id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/course-list/rounds/${round._id}`)}
                    >
                        <td className="p-3">{formatDate(round.date)}</td>
                        <td className="p-3">{round.course?.name || 'Unbekannter Platz'}</td>
                        <td className="p-3">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: round.playedTee?.color || 'transparent' }}
                                />
                                {round.playedTee?.name || 'Unbekannter Abschlag'}
                            </div>
                        </td>
                        <td className="p-3 text-right">{round.totals?.gross ?? '–'}</td>
                        <td className="p-3 text-right">{round.totals?.net ?? '–'}</td>
                        <td className="p-3 text-right">{round.totals?.stableford ?? '–'}</td>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <DeleteRoundButton roundId={round._id} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
