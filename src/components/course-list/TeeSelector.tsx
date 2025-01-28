// src/components/course-list/TeeSelector.tsx
import React from 'react';
import type { Tee } from '@/types/golf-course';
import type { PlayedTee } from '@/types/golf-round';

interface TeeSelectorProps {
    tees: Tee[];
    selectedTee: PlayedTee | undefined;
    onTeeSelect: (tee: Tee) => void;
}

export default function TeeSelector({ tees, selectedTee, onTeeSelect }: TeeSelectorProps) {
    const getColorDisplay = (color: string): string => {
        const colorMap: Record<string, string> = {
            white: '#FFFFFF',
            yellow: '#FFD700',
            blue: '#0000FF',
            red: '#FF0000'
        };
        return colorMap[color] || color;
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Abschlag wählen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tees.map((tee) => {
                    const isSelected = selectedTee?.name === tee.name &&
                        selectedTee?.color === tee.color;

                    return (
                        <button
                            key={`${tee.color}-${tee.name}-${tee.gender}`}
                            onClick={() => onTeeSelect(tee)}
                            className={`
                                p-4 rounded-lg border transition-all
                                ${isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-200'
                            }
                            `}
                            type="button"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: getColorDisplay(tee.color) }}
                                />
                                <div>
                                    <div className="font-medium">{tee.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {tee.gender}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>CR: {tee.courseRating}</div>
                                <div>SR: {tee.slopeRating}</div>
                                <div>Par: {tee.par}</div>
                                <div>Länge: {tee.holes.reduce((sum, hole) => sum + (hole.length || 0), 0)}m</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}