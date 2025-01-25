"use client";

import { useEffect, useState } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { getVertragsmodelle } from "@/lib/sanity/getVertragsmodell";
import type { Vertragsmodell, VertragsFeature, SortedFeature } from "@/types/vertragsmodell";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function PricingTable() {
    const [loading, setLoading] = useState<string | null>(null);
    const [vertragsmodelle, setVertragsmodelle] = useState<Vertragsmodell[]>([]);
    const [sortedFeatures, setSortedFeatures] = useState<SortedFeature[]>([]);

// Präzisere Type-Guards und Error-Handling
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getVertragsmodelle();
                const orderedData = ['Starter', 'Growth', 'Scale']
                    .map(name => data?.find((m: Vertragsmodell) => m.name === name))
                    .filter((m): m is Vertragsmodell => m !== undefined);

                setVertragsmodelle(orderedData);

                if (orderedData[0]?.features) {
                    const mappedFeatures: SortedFeature[] = orderedData[0].features.map((feat: VertragsFeature) => {
                        const tiers = orderedData.reduce<Record<string, number>>((acc, tier) => {
                            const tierFeature = tier.features?.find(
                                (f: VertragsFeature) => f.featureDetails.name === feat.featureDetails.name
                            );
                            acc[tier.name] = tierFeature?.limit ?? 0;
                            return acc;
                        }, {});

                        return {
                            id: `${feat.featureDetails.name}-${feat.featureDetails.typ}`,
                            name: feat.featureDetails.name,
                            beschreibung: feat.featureDetails.beschreibung,
                            typ: feat.featureDetails.typ,
                            tiers,
                            nonZeroCount: Object.values(tiers).filter((v: number) => v > 0).length
                        };
                    });

                    setSortedFeatures(mappedFeatures.sort((a, b) => b.nonZeroCount - a.nonZeroCount));
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Fehler beim Laden der Vertragsmodelle:", error.message);
                }
            }
        };

        void fetchData();
    }, []);

    // Rest des Codes bleibt gleich...

    const handleUpgrade = async (planName: string) => {
        setLoading(planName);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: planName })
            });
            if (!res.ok) throw new Error('Upgrade fehlgeschlagen');
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch {
            alert('Plan-Upgrade fehlgeschlagen. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoading(null);
        }
    };

    const renderFeatureValue = (value: number, typ: string) => {
        if (typ === 'counter') {
            return value > 0 ? (
                <div className="text-center text-sm text-green-600 font-medium">{value}</div>
            ) : (
                <XMarkIcon className="mx-auto h-5 w-5 text-gray-400" />
            );
        }
        return value === 1 ? (
            <CheckIcon className="mx-auto h-5 w-5 text-green-600" />
        ) : (
            <XMarkIcon className="mx-auto h-5 w-5 text-gray-400" />
        );
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold text-green-600">Pricing</h2>
                    <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                        Wählen Sie Ihren Plan
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-600">
                    Alle Pläne beinhalten unsere Kernfunktionen
                </p>

                {/* Mobile */}
                <div className="mx-auto mt-12 max-w-md space-y-8 sm:mt-16 lg:hidden">
                    {vertragsmodelle.map((tier) => (
                        <section
                            key={tier.name}
                            className={classNames(
                                tier.name === "Growth" ? 'rounded-xl bg-gray-400/5 ring-1 ring-inset ring-gray-200' : '',
                                'p-8'
                            )}
                        >
                            <h3 className="text-sm font-semibold text-gray-900">
                                {tier.name}
                            </h3>
                            <p className="mt-2 flex items-baseline gap-x-1">
                                <span className="text-4xl font-semibold text-gray-900">€{tier.preis}</span>
                                <span className="text-sm font-semibold text-gray-900">/month</span>
                            </p>
                            <button
                                onClick={() => handleUpgrade(tier.name)}
                                disabled={loading === tier.name}
                                className={classNames(
                                    tier.name === "Growth"
                                        ? 'bg-green-600 text-white hover:bg-green-500'
                                        : 'text-green-600 ring-1 ring-inset ring-green-200 hover:ring-green-300',
                                    'mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold'
                                )}
                            >
                                {loading === tier.name ? "Wird verarbeitet..." : "Jetzt wählen"}
                            </button>
                            <ul role="list" className="mt-10 space-y-4 text-sm text-gray-900">
                                {sortedFeatures.map((feature) => (
                                    <li key={feature.id} className="flex gap-x-3">
                                        {renderFeatureValue(feature.tiers[tier.name], feature.typ)}
                                        <span className="group relative">
                      {feature.name}
                                            {feature.beschreibung && (
                                                <span className="invisible group-hover:visible absolute left-0 bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2">
                          {feature.beschreibung}
                        </span>
                                            )}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>

                {/* Desktop */}
                <div className="isolate mt-20 hidden lg:block">
                    <div className="relative -mx-8">
                        {vertragsmodelle.some((tier) => tier.name === "Growth") && (
                            <div className="absolute inset-x-4 inset-y-0 -z-10 flex">
                                <div
                                    className="flex w-1/4 px-4"
                                    style={{ marginLeft: `${(vertragsmodelle.findIndex((tier) => tier.name === "Growth") + 1) * 25}%` }}
                                >
                                    <div className="w-full rounded-t-xl border-x border-t border-gray-900/10 bg-gray-400/5" />
                                </div>
                            </div>
                        )}
                        <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
                            <colgroup>
                                <col className="w-1/4" />
                                {vertragsmodelle.map((tier) => (
                                    <col key={tier.name} className="w-1/4" />
                                ))}
                            </colgroup>
                            <thead>
                            <tr>
                                <td />
                                {vertragsmodelle.map((tier) => (
                                    <th key={tier.name} scope="col" className="px-6 pt-6 xl:px-8 xl:pt-8">
                                        <div className="text-sm font-semibold text-gray-900">{tier.name}</div>
                                        <div className="mt-4 flex items-baseline gap-x-1">
                                            <span className="text-4xl font-semibold text-gray-900">€{tier.preis}</span>
                                            <span className="text-sm font-semibold text-gray-900">/month</span>
                                        </div>
                                        <button
                                            onClick={() => handleUpgrade(tier.name)}
                                            disabled={loading === tier.name}
                                            className={classNames(
                                                tier.name === "Growth"
                                                    ? 'bg-green-600 text-white hover:bg-green-500'
                                                    : 'text-green-600 ring-1 ring-inset ring-green-200 hover:ring-green-300',
                                                'mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold'
                                            )}
                                        >
                                            {loading === tier.name ? "Wird verarbeitet..." : "Jetzt wählen"}
                                        </button>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {sortedFeatures.map((feature) => (
                                <tr key={feature.id}>
                                    <th scope="row" className="py-4 text-sm font-normal text-gray-900 group relative">
                                        {feature.name}
                                        {feature.beschreibung && (
                                            <span className="invisible group-hover:visible absolute left-0 top-full mt-2 w-48 bg-gray-900 text-white text-xs rounded p-2 z-10">
                          {feature.beschreibung}
                        </span>
                                        )}
                                        <div className="absolute inset-x-8 mt-4 h-px bg-gray-900/5" />
                                    </th>
                                    {vertragsmodelle.map((tier) => (
                                        <td key={tier.name} className="px-6 py-4 xl:px-8">
                                            {renderFeatureValue(feature.tiers[tier.name], feature.typ)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}