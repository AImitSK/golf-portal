// src/components/course-list/FilteredRoundsList.tsx
'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import RoundsList from "@/components/course-list/RoundsList";
import RoundsFilter from "@/components/course-list/RoundsFilter";
import type { Round } from '@/types/round';

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
                rounds={initialRounds}
                onFilterChangeAction={handleFilterChange}
            />
            <Card>
                <RoundsList rounds={filteredRounds} />
            </Card>
        </div>
    );
}