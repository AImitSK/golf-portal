'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import RoundsList from "@/components/course-list/RoundsList";
import RoundsFilter from "@/components/course-list/RoundsFilter";
import type { PlayedRound } from '@/types/played-round';

// Basis-Typ für `course`
type BaseCourse = {
    _ref: string;
    _type: "reference";
};

// Erweiterter Typ für `course`
type ExtendedCourse = BaseCourse & {
    _id: string; // Abgeleitet aus _ref
    name: string; // Garantierter Name
};

// Erweiterter Typ für `PlayedRound`
type ExtendedPlayedRound = Omit<PlayedRound, 'course'> & {
    course: ExtendedCourse; // Verwende den erweiterten Typ
};

interface FilteredRoundsListProps {
    initialRounds: PlayedRound[];
}

export default function FilteredRoundsList({ initialRounds }: FilteredRoundsListProps) {
    // Transformiere Runden und erweitere `course`
    const transformRounds = (rounds: PlayedRound[]): ExtendedPlayedRound[] =>
        rounds.map(round => ({
            ...round,
            course: {
                _ref: round.course?._ref || "unknown", // Sicherer Zugriff auf `_ref`
                _type: "reference",
                _id: round.course?._ref || "unknown", // Erzeuge `_id` aus `_ref`
                name: "Unbekannter Golfplatz", // Setze Standardname
            },
        }));

    // Transformiere die initialen Runden
    const [filteredRounds, setFilteredRounds] = useState<ExtendedPlayedRound[]>(
        transformRounds(initialRounds)
    );

    const handleFilterChange = (newRounds: PlayedRound[]) => {
        setFilteredRounds(transformRounds(newRounds));
    };

    return (
        <div>
            <RoundsFilter
                rounds={initialRounds} // Untransformierte Daten für Filter
                onFilterChangeAction={handleFilterChange}
            />
            <Card>
                <RoundsList rounds={filteredRounds} /> {/* Transformierte Daten */}
            </Card>
        </div>
    );
}
