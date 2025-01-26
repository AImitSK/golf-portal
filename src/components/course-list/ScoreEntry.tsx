// src/components/course-list/ScoreEntry.tsx
import React, { useState } from 'react';
import TeeSelector from './TeeSelector';
import Scorecard from './Scorecard';
import type { Tee, GolfCourse } from '@/types/golf-course';

interface ScoreEntryProps {
    course: GolfCourse;
    playerHandicap: number;
    onSubmit: (data: {
        tee: Tee;
        scores: number[];
        totalGross: number;
        totalNet: number;
        totalStableford: number;
    }) => void;
}

export default function ScoreEntry({ course, playerHandicap, onSubmit }: ScoreEntryProps) {
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
                    onSubmit={onSubmit}
                />
            )}
        </div>
    );
}