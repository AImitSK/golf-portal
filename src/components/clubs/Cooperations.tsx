// src/components/clubs/Cooperations.tsx
import React from 'react';
import { Kooperation } from '@/types/club-types';
import { Heading } from "@/components/frontend-ui/Heading";

interface CooperationsProps {
    cooperations: Kooperation[];
}

export const Cooperations: React.FC<CooperationsProps> = ({ cooperations }) => {
    if (!cooperations || cooperations.length === 0) {
        return (
            <p className="text-sm text-gray-500 text-center col-span-4">
                Keine Kooperationen verfügbar.
            </p>
        );
    }

    return (
        <div className="mb-12 mt-20">
            <Heading level={2} variant="section">
                Kooperationen
            </Heading>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {cooperations.map((cooperation) => {
                    const {slug, logo, name, _id} = cooperation;

                    return slug ? (
                        <a
                            key={_id || slug} // Fallback: slug, falls _id nicht vorhanden ist
                            href={`/kooperationen/${slug}`}
                            className="block"
                        >
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={name || 'Kooperation'}
                                    className="w-auto h-[80px] object-contain" // Entfernt "mx-auto" für Links-Bündigkeit
                                />
                            ) : (
                                <div className="bg-gray-200 text-left py-4"> {/* Text jetzt linksbündig */}
                                    <span className="text-sm text-gray-500">Kein Logo vorhanden</span>
                                </div>
                            )}
                        </a>
                    ) : (
                        <div
                            key={_id || Math.random()} // Math.random als Fallback, falls beides fehlt
                            className="block bg-gray-200 text-left py-4" // Text ebenfalls linksbündig
                        >
                            <span className="text-sm text-gray-500">Kein Link vorhanden</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};