// src/components/course-list/FilteredRoundsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import RoundsList from "@/components/course-list/RoundsList";
import RoundsFilter from "@/components/course-list/RoundsFilter";
import type { Round } from '@/types/round';

interface FilteredRoundsListProps {
    initialRounds: Round[];
}

export default function FilteredRoundsList({ initialRounds }: FilteredRoundsListProps) {
    const [rounds, setRounds] = useState(initialRounds);
    const [filteredRounds, setFilteredRounds] = useState(initialRounds);

    // Aktualisiere den State, wenn sich initialRounds ändert
    useEffect(() => {
        setRounds(initialRounds);
        setFilteredRounds(initialRounds);
    }, [initialRounds]);

    const handleFilterChange = (newRounds: Round[]) => {
        setFilteredRounds(newRounds);
    };

    const handleRoundDelete = (roundId: string, playKey: string) => {
        // Entferne den gelöschten Play-Eintrag aus den Rounds
        const updatedRounds = rounds
            .map(round => ({
                ...round,
                plays: round.plays.filter(play =>
                    !(round._id === roundId && play._key === playKey)
                )
            }))
            .filter(round => round.plays.length > 0); // Entferne Rounds ohne Plays

        setRounds(updatedRounds);

        // Aktualisiere auch die gefilterten Rounds
        const updatedFilteredRounds = filteredRounds
            .map(round => ({
                ...round,
                plays: round.plays.filter(play =>
                    !(round._id === roundId && play._key === playKey)
                )
            }))
            .filter(round => round.plays.length > 0);

        setFilteredRounds(updatedFilteredRounds);
    };

    return (
        <div>
            <RoundsFilter
                rounds={rounds}
                onFilterChangeAction={handleFilterChange}
            />
            <Card>
                <RoundsList
                    rounds={filteredRounds}
                    onRoundDelete={handleRoundDelete}
                />
            </Card>
        </div>
    );
}