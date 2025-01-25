// src/components/dashboard/PlanSelection.tsx
"use client";
import { useState, useEffect } from "react";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid"; // Korrektur des Icon-Namens
import { getVertragsmodelle } from "@/lib/sanity/getVertragsmodell";
import { CheckIcon } from "@heroicons/react/24/solid";

interface Vertragsmodell {
    name: string;
    preis: number;
    beschreibung: string;
    features: {
        name: string;
        beschreibung: string;
        icon: string;
        limitierung: {
            hat_limit: boolean;
            limit_wert?: number;
            limit_einheit?: string;
        } | null;
    }[];
    supportLevel: string;
    stripePriceId: string;
    isTopPosition: boolean;
}

export default function PlanSelection() {
    const [loading, setLoading] = useState<string | null>(null);
    const [vertragsmodelle, setVertragsmodelle] = useState<Vertragsmodell[]>([]);

    useEffect(() => {
        getVertragsmodelle().then(setVertragsmodelle);
    }, []);

    const handleUpgrade = async (planName: string) => {
        setLoading(planName);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: planName })
            });

            if (!res.ok) throw new Error('Upgrade failed');
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch {
            alert('Plan-Upgrade fehlgeschlagen. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vertragsmodelle.map((modell) => (
                <div
                    key={modell.name}
                    className="relative border rounded-lg p-6 bg-white"
                >
                    <h3 className="text-lg font-medium">{modell.name}</h3>
                    <p className="mt-2 text-2xl font-bold">€{modell.preis}</p>
                    <p className="text-sm text-gray-500">pro Monat</p>
                    <p className="mt-2 text-sm text-gray-500">{modell.beschreibung}</p>

                    <ul className="mt-6 space-y-4">
                        {modell.features.map((feature) => (
                            <li key={feature.name} className="flex items-start">
                                <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <div className="ml-3">
                                    <span className="font-medium">{feature.name}</span>
                                    {feature.limitierung?.hat_limit && (
                                        <span className="block text-gray-500">
                                            Bis zu {feature.limitierung.limit_wert} {feature.limitierung.limit_einheit}
                                        </span>
                                    )}
                                    {feature.beschreibung && (
                                        <span className="block text-gray-500">{feature.beschreibung}</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleUpgrade(modell.name)}
                        disabled={loading === modell.name}
                        className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#006633] hover:bg-[#2CDB48] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006633] disabled:opacity-50"
                    >
                        {loading === modell.name ? (
                            "Wird verarbeitet..."
                        ) : (
                            <>
                                Plan auswählen
                                <ArrowLongRightIcon className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
}