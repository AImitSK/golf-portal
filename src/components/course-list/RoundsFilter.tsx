// src/components/course-list/RoundsFilter.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Round } from '@/types/round';

interface RoundsFilterProps {
    rounds: Round[];
    onFilterChangeAction: (filtered: Round[]) => void;
}

export default function RoundsFilter({ rounds, onFilterChangeAction }: RoundsFilterProps) {
    const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
    const [selectedCourse, setSelectedCourse] = useState<string>('');

    const uniqueCourses = Array.from(
        new Set(rounds.map(round => round.club._id))
    );

    const applyFilters = () => {
        let filtered = [...rounds];

        if (dateRange.from) {
            filtered = filtered.filter(round =>
                round.plays.some(play => new Date(play.date) >= new Date(dateRange.from!))
            );
        }

        if (dateRange.to) {
            filtered = filtered.filter(round =>
                round.plays.some(play => new Date(play.date) <= new Date(dateRange.to!))
            );
        }

        if (selectedCourse) {
            filtered = filtered.filter(round =>
                round.club._id === selectedCourse
            );
        }

        onFilterChangeAction(filtered);
    };

    return (
        <Card className="mb-6">
            <CardContent className="py-4">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Von
                        </label>
                        <input
                            type="date"
                            value={dateRange.from || ''}
                            onChange={e => {
                                setDateRange(prev => ({ ...prev, from: e.target.value }));
                                applyFilters();
                            }}
                            className="border rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bis
                        </label>
                        <input
                            type="date"
                            value={dateRange.to || ''}
                            onChange={e => {
                                setDateRange(prev => ({ ...prev, to: e.target.value }));
                                applyFilters();
                            }}
                            className="border rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Golfplatz
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={e => {
                                setSelectedCourse(e.target.value);
                                applyFilters();
                            }}
                            className="border rounded-md p-2"
                        >
                            <option value="">Alle Plätze</option>
                            {uniqueCourses.map(courseId => (
                                <option key={courseId} value={courseId}>
                                    {rounds.find(r => r.club._id === courseId)?.club.name || 'Unbekannter Golfplatz'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setDateRange({});
                            setSelectedCourse('');
                            onFilterChangeAction(rounds);
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Filter zurücksetzen
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}