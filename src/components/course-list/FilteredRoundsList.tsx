'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import RoundsList from "@/components/course-list/RoundsList";
import RoundsFilter from "@/components/course-list/RoundsFilter";

interface RoundPlay {
    _key: string;
    date: string;
    score: number;
    notiz?: string;
    wetter?: string;
}

interface Round {
    _id: string;
    club: {
        _id: string;
        name: string;
    };
    plays: RoundPlay[];
}

interface FilteredRoundsListProps {
    initialRounds: Round[];
}

export default function FilteredRoundsList({ initialRounds }: FilteredRoundsListProps) {
    const [filteredRounds, setFilteredRounds] = useState(initialRounds);

    const handleFilterChange = (newRounds: Round[]) => {
        setFilteredRounds(newRounds);
    };

    return (
        <div>
            <RoundsFilter
                rounds={initialRounds} // Die Originaldaten für die Filterkomponente
                onFilterChangeAction={handleFilterChange} // Funktion zum Aktualisieren der gefilterten Daten
            />
            <Card>
                <RoundsList rounds={filteredRounds} /> {/* Gefilterte Daten an die Anzeige-Komponente übergeben */}
            </Card>
        </div>
    );
}
