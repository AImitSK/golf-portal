// src/components/clubs/Cooperations.tsx
import React from 'react';
import { Heading } from '@/components/frontend-ui/Heading';
import { Kooperation } from '@/types/club-types';

interface CooperationsProps {
    cooperations: Kooperation[];
}

export const Cooperations: React.FC<CooperationsProps> = ({ cooperations }) => {
    if (!cooperations || cooperations.length === 0) {
        return null;
    }

    return (
        <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cooperations.map((cooperation, index) => (
                    <div key={index} className="flex justify-left items-left">
                        {cooperation.logo && (
                            <img
                                src={cooperation.logo}
                                alt={cooperation.name}
                                className="max-w-[250px] h-auto"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};