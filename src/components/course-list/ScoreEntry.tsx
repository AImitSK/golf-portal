// src/components/course-list/ScoreEntry.tsx
'use client';

import React, { useState } from 'react';
import TeeSelector from './TeeSelector';
import Scorecard from './Scorecard';
import type {
    GolfCourse,
    Tee,
    TeeColor
} from '@/types/golf-course';

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

interface ScoreEntryProps {
    course: GolfCourse;
    playerHandicap: number;
    onSubmit: (data: ScoreSubmissionData) => Promise<void>;
}

export default function ScoreEntry({ course, playerHandicap, onSubmit }: ScoreEntryProps) {
    const [selectedTee, setSelectedTee] = useState<Tee | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTeeSelect = (tee: Tee) => {
        setSelectedTee(tee);
        setError(null);
    };

    const handleScoreSubmit = async (data: Omit<ScoreSubmissionData, 'courseId' | 'playerHandicap'>) => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Füge courseId und playerHandicap hinzu
            const completeData: ScoreSubmissionData = {
                ...data,
                courseId: course._id,
                playerHandicap: playerHandicap
            };

            await onSubmit(completeData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
            // Scroll zum Fehler
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded sticky top-4 z-50">
                    <p className="font-medium">Fehler beim Speichern</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Course Info */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                <p className="text-gray-600">
                    Aktuelles Handicap: {playerHandicap}
                </p>
            </div>

            {/* Tee Selection */}
            <TeeSelector
                tees={course.tees}
                selectedTee={selectedTee}
                onTeeSelect={handleTeeSelect}
            />

            {/* Scorecard */}
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