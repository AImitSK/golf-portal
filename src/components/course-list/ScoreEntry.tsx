// src/components/course-list/ScoreEntry.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TeeSelector from './TeeSelector';
import Scorecard from './Scorecard';
import type { PlayedTee, GolfCourse, ScoreInputData } from '@/types/golf-round';

interface ScoreEntryProps {
    course: GolfCourse;
    playerHandicap: number;
    userId: string;
}

export default function ScoreEntry({ course, playerHandicap, userId }: ScoreEntryProps) {
    const router = useRouter();
    const [selectedTee, setSelectedTee] = useState<PlayedTee | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTeeSelect = (tee: PlayedTee) => {
        setSelectedTee(tee);
        setError(null);
    };

    const handleScoreSubmit = async (data: ScoreInputData) => {
        try {
            const numberOfHoles = selectedTee?.holes?.length || 0;
            const missingScores = data.scores.slice(0, numberOfHoles).some(score => !score);
            if (missingScores) {
                throw new Error(`Bitte geben Sie Scores für alle ${numberOfHoles} Löcher ein`);
            }

            setIsSubmitting(true);
            setError(null);

            const response = await fetch('/api/course-list/add-round', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': userId,
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Fehler beim Speichern der Runde');
            }

            // Erfolgreich gespeichert - kurz warten und dann redirecten
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/course-list');
        } catch (error) {
            console.error('Score submit error:', error);
            setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded sticky top-4 z-50">
                    <p className="font-medium">Fehler beim Speichern</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                <p className="text-gray-600">
                    Aktuelles Handicap: {playerHandicap}
                </p>
            </div>

            <TeeSelector
                tees={course.tees}
                selectedTee={selectedTee}
                onTeeSelect={handleTeeSelect}
            />

            {selectedTee && (
                <div className="relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    <Scorecard
                        tee={selectedTee}
                        playerHandicap={playerHandicap}
                        courseId={course._id}
                        onSubmit={handleScoreSubmit}
                    />
                </div>
            )}
        </div>
    );
}