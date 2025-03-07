// src/components/course-list/RoundsList.tsx
'use client';

import React from 'react';
import { formatDate } from '@/lib/utils';
import DeleteRoundButton from '@/components/course-list/DeleteRoundButton';

// Definiere die benötigten Types
interface Course {
    _id: string;
    name: string;
    slug?: { current: string };
}

interface PlayedTee {
    name: string;
    color: string;
    gender: string;
    courseRating: number;
    slopeRating: number;
    par: number;
}

interface Totals {
    gross: number;
    net: number;
    stableford: number;
}

interface GolfRound {
    _id: string;
    date: string;
    course: Course;
    playedTee: PlayedTee;
    totals: Totals;
    weather?: string;
    notes?: string;
}

interface RoundsListProps {
    rounds: GolfRound[];
    onRoundDelete?: (roundId: string) => void;
}

export default function RoundsList({ rounds, onRoundDelete }: RoundsListProps) {
    const handleDelete = (roundId: string) => {
        onRoundDelete?.(roundId);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="p-3 text-left">Datum</th>
                    <th className="p-3 text-left">Platz</th>
                    <th className="p-3 text-center">Abschlag</th>
                    <th className="p-3 text-right">Brutto</th>
                    <th className="p-3 text-right">Netto</th>
                    <th className="p-3 text-right">Stableford</th>
                    <th className="p-3 text-left">Wetter</th>
                    <th className="p-3 text-left">Notizen</th>
                    <th className="p-3"></th>
                </tr>
                </thead>
                <tbody>
                {rounds.map((round) => (
                    <tr
                        key={round._id}
                        className="border-b hover:bg-gray-50"
                    >
                        <td className="p-3">{formatDate(round.date)}</td>
                        <td className="p-3">{round.course.name}</td>
                        <td className="p-3 text-center">
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                                ${getColorClass(round.playedTee.color)}`}
                            >
                                {round.playedTee.name}
                            </span>
                        </td>
                        <td className="p-3 text-right">{round.totals.gross}</td>
                        <td className="p-3 text-right">{round.totals.net}</td>
                        <td className="p-3 text-right font-medium">{round.totals.stableford}</td>
                        <td className="p-3">{getWeatherIcon(round.weather)}</td>
                        <td className="p-3">{round.notes || '-'}</td>
                        <td className="p-3">
                            <DeleteRoundButton
                                roundId={round._id}
                                playKey={round._id} // Da wir keine separaten playKeys mehr haben
                                onDelete={() => handleDelete(round._id)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function getColorClass(color: string): string {
    switch (color.toLowerCase()) {
        case 'white':
            return 'bg-gray-100 text-gray-800';
        case 'yellow':
            return 'bg-yellow-100 text-yellow-800';
        case 'blue':
            return 'bg-blue-100 text-blue-800';
        case 'red':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function getWeatherIcon(weather: string | undefined): string {
    if (!weather) return '-';

    switch (weather.toLowerCase()) {
        case 'sunny':
            return '☀️';
        case 'cloudy':
            return '☁️';
        case 'rainy':
            return '🌧️';
        case 'windy':
            return '💨';
        default:
            return weather;
    }
}