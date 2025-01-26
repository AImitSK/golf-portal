'use client';

import React, { useState } from 'react';
import TeeSelector from './TeeSelector';
import Scorecard from './Scorecard';
import type { Tee, GolfCourse } from '@/types/golf-course';

interface ScoreSubmissionData {
    tee: Tee;
    scores: number[];
    totalGross: number;
    totalNet: number;
    totalStableford: number;
}

interface ScoreEntryProps {
    course: GolfCourse;
    playerHandicap: number;
    onSubmitAction: (data: ScoreSubmissionData) => void; // Korrekte Typdefinition
}

export default function ScoreEntry({ course, playerHandicap, onSubmitAction }: ScoreEntryProps) {
    const [selectedTee, setSelectedTee] = useState<Tee | undefined>();
    const [isReadyToScore, setIsReadyToScore] = useState(false);

    const handleTeeSelect = (tee: Tee) => {
        setSelectedTee(tee);
        setIsReadyToScore(true);
    };

    return (
        <div className="space-y-6">
            <TeeSelector
                tees={course.tees}
                selectedTee={selectedTee}
                onTeeSelect={handleTeeSelect}
            />

            {isReadyToScore && selectedTee && (
                <Scorecard
                    tee={selectedTee}
                    playerHandicap={playerHandicap}
                    onSubmit={(data: ScoreSubmissionData) => {
                        onSubmitAction(data); // Aufruf des übergebenen Handlers
                    }}
                />
            )}
        </div>
    );
}
