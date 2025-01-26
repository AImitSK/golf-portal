// src/components/course-list/TeeSelector.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import type { Tee } from '@/types/golf-course';

interface TeeSelectorProps {
    tees: Tee[];
    selectedTee?: Tee;
    onTeeSelect: (tee: Tee) => void;
}

export default function TeeSelector({ tees, selectedTee, onTeeSelect }: TeeSelectorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Abschlag wählen</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tees.map((tee) => (
                        <button
                            key={`${tee.color}-${tee.gender}`}
                            onClick={() => onTeeSelect(tee)}
                            className={`
                p-4 rounded-lg border transition-colors
                ${selectedTee?.color === tee.color ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                hover:border-blue-300
              `}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: tee.color }}
                                />
                                <div className="text-left">
                                    <div className="font-medium">{tee.name}</div>
                                    <div className="text-sm text-gray-500">
                                        CR: {tee.courseRating} / SR: {tee.slopeRating}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}