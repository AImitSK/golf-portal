"use client";

import { useState, useEffect } from "react";
import { ArrowLongRightIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { getVertragsmodelle } from "@/lib/sanity/getVertragsmodell";
import type { Vertragsmodell, VertragsFeature } from "@/types/vertragsmodell";

function classNames(...classes: (string | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function PlanSelection() {
    const [loading, setLoading] = useState<string | null>(null);
    const [vertragsmodelle, setVertragsmodelle] = useState<Vertragsmodell[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getVertragsmodelle();

                // Daten sicherstellen, dass sie ein Array sind
                if (!Array.isArray(data)) {
                    console.error("Fehler: Vertragsmodelle-Daten sind kein Array:", data);
                    return;
                }

                const orderedData = ['Starter', 'Growth', 'Scale']
                    .map(name => data?.find((m: Vertragsmodell) => m.name === name))
                    .filter((m): m is Vertragsmodell => m !== undefined);

                const sortFeatures = (features: VertragsFeature[]) => {
                    return [...features].sort((a, b) => {
                        const countA = orderedData.filter(model =>
                            model.features.find(f =>
                                f.featureDetails.name === a.featureDetails.name
                            )?.limit > 0
                        ).length;
                        const countB = orderedData.filter(model =>
                            model.features.find(f =>
                                f.featureDetails.name === b.featureDetails.name
                            )?.limit > 0
                        ).length;
                        return countB - countA;
                    });
                };

                setVertragsmodelle(
                    orderedData.map(model => ({
                        ...model,
                        features: sortFeatures(model.features)
                    }))
                );
            } catch (error) {
                console.error("Fehler beim Laden der Vertragsmodelle:", error);
            }
        };

        void fetchData();
    }, []);

    const handleUpgrade = async (planName: string) => {
        setLoading(planName);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: planName })
            });
            if (!res.ok) throw new Error("Upgrade fehlgeschlagen");
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch {
            alert("Plan-Upgrade fehlgeschlagen. Bitte versuchen Sie es später erneut.");
        } finally {
            setLoading(null);
        }
    };

    const formatPrice = (price: number | null | undefined): string => {
        if (price === null || price === undefined || price === 0) {
            return "0";
        }
        return price.toString();
    };

    const renderFeatureValue = (feature: VertragsFeature) => {
        if (feature.featureDetails.typ === "counter") {
            return feature.limit > 0 ? (
                <div className="text-center text-sm text-dark-green font-medium">{feature.limit}</div>
            ) : (
                <XMarkIcon className="h-5 w-5 text-aktion-red flex-shrink-0" />
            );
        }
        return feature.limit === 1 ? (
            <CheckIcon className="h-5 w-5 text-dark-green flex-shrink-0" />
        ) : (
            <XMarkIcon className="h-5 w-5 text-aktion-red flex-shrink-0" />
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vertragsmodelle.map((tier) => (
                <div
                    key={tier.name}
                    className={classNames(
                        tier.name === "Growth"
                            ? "bg-dark-6 border-dark-green"
                            : "bg-white border-dark/10",
                        "relative rounded-lg p-8 border shadow-sm"
                    )}
                >
                    <div>
                        {tier.bild && tier.bild.asset && tier.bild.asset.url ? (
                            <img
                                src={tier.bild.asset.url}
                                alt={tier.name}
                                className="h-12 w-auto mb-4"
                            />
                        ) : (
                            <div className="h-12 w-auto mb-4 bg-gray-200 flex items-center justify-center">
                                <span className="text-sm text-gray-500">Kein Logo</span>
                            </div>
                        )}
                        <p className="mt-4 flex items-baseline">
                            <span className="text-4xl font-semibold text-dark">€{formatPrice(tier.preis)}</span>
                            <span className="ml-1 text-sm font-medium text-dark">/month</span>
                        </p>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => handleUpgrade(tier.name)}
                            disabled={loading === tier.name}
                            className={classNames(
                                tier.name === "Growth"
                                    ? "bg-cta-green text-white hover:bg-dark-green"
                                    : "text-dark-green ring-1 ring-inset ring-dark-green hover:bg-dark-green hover:text-white",
                                "w-full rounded-md px-3 py-2 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                            )}
                        >
                            {loading === tier.name ? (
                                "Wird verarbeitet..."
                            ) : (
                                <>
                                    Plan auswählen
                                    <ArrowLongRightIcon className="h-4 w-4"/>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8">
                        <ul className="space-y-3">
                            {tier.features?.map((feature, idx) => (
                                <li
                                    key={`${feature.featureDetails.name}-${idx}`}
                                    className="flex items-start justify-between gap-3"
                                >
                                    <p className="font-medium text-dark">{feature.featureDetails.name}</p>
                                    {renderFeatureValue(feature)}
                                </li>
                            )) ?? (
                                <li className="text-sm text-gray-500">Keine Features verfügbar</li>
                            )}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}