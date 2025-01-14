'use client';

import React from 'react';
import { Heading } from "@/components/frontend-ui/Heading";
import { CheckCircle, XCircle } from 'lucide-react';
import type { GolfClub } from "@/types/club-types";

interface TournamentTableProps {
    turniere: GolfClub['turniere'];
}

const TournamentTable: React.FC<TournamentTableProps> = ({ turniere }) => {
    if (!turniere) return null;

    const tournamentList = [
        { key: 'club', label: 'Club-Turniere und Events', available: turniere.club },
        { key: 'gaeste', label: 'Turniere und Events für Gäste', available: turniere.gaeste },
        { key: 'rangliste', label: 'Ranglisten Turniere', available: turniere.rangliste },
    ];

    return (
        <div className="w-full">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <Heading level={3} className="text-xl font-semibold text-dark-green">
                        Turniere & Events
                    </Heading>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black/5 rounded-lg">
                            <table className="min-w-full divide-y divide-dark-green/10">
                                <thead className="bg-dark-green/5">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-dark-green sm:pl-6">
                                        Art
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark-green">
                                        Status
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-green/10 bg-white">
                                {tournamentList.map((item) => (
                                    <tr key={item.key}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-dark-green sm:pl-6">
                                            {item.label}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-dark-60">
                                            <div className="flex items-center gap-2">
                                                {item.available ? (
                                                    <>
                                                        <CheckCircle className="w-5 h-5 text-cta-green" />
                                                        <span>Verfügbar</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-5 h-5 text-dark-20" />
                                                        <span>Nicht verfügbar</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentTable;