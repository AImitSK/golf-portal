"use client";

import React, { useState, useEffect } from "react";
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
import { getKooperation } from "@/lib/sanity/GetKooperation";

export default function PlatformStats() {
    const [golfClubCount, setGolfClubCount] = useState(0);
    const [kooperationenCount, setKooperationenCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [clubs, kooperationen] = await Promise.all([
                    getGolfClubs(),
                    getKooperation(),
                ]);

                setGolfClubCount(clubs.length);
                setKooperationenCount(kooperationen.length);
            } catch (error) {
                console.error("Fehler beim Laden der Statistiken:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    const stats = [
        {
            id: 1,
            name: "Eingetragene Golfplätze",
            value: isLoading ? "..." : golfClubCount.toLocaleString(),
        },
        {
            id: 2,
            name: "Kooperationen und Verbunde",
            value: isLoading ? "..." : kooperationenCount.toLocaleString(),
        },
        {
            id: 3,
            name: "Besucher am Tag",
            value: "1.200",
        },
        {
            id: 4,
            name: "Angemeldete User",
            value: "3.600",
        },
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none text-center">
                    {/* Überschrift */}
                    <h2 className="text-5xl font-semibold tracking-tight text-green-800">
                        Dein neues Zuhause für alle Golferlebnisse
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Unser Ziel: Alles, was du für dein Golfspiel brauchst, an einem Ort.
                    </p>
                </div>
                <dl className="mt-16 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-xl bg-gray-50 text-center shadow sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-gray-200">
                    {stats.map((stat) => (
                        <div key={stat.id} className="flex flex-col p-8">
                            <dd className="text-4xl font-bold text-cta-green">
                                {stat.value}
                            </dd>
                            <dt className="mt-2 text-base font-semibold text-gray-900">
                                {stat.name}
                            </dt>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}