"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { getVertragsmodelle } from "@/lib/sanity/getVertragsmodell";
import type { Vertragsmodell, VertragsFeature, SortedFeature } from "@/types/vertragsmodell";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function PricingTable() {
    const [loading, setLoading] = useState<string | null>(null);
    const [vertragsmodelle, setVertragsmodelle] = useState<Vertragsmodell[]>([]);
    const [sortedFeatures, setSortedFeatures] = useState<SortedFeature[]>([]);

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

    const formatPrice = (price: number | null | undefined): string => {
        if (price === null || price === undefined || price === 0) {
            return '0';
        }
        return price.toString();
    };

    const renderFeatureValue = (value: number, typ: string) => {
        if (typ === 'counter') {
            return value > 0 ? (
                <div className="text-center text-sm text-dark-green font-medium">{value}</div>
            ) : (
                <XMarkIcon className="mx-auto h-5 w-5 text-aktion-red" />
            );
        }
        return value === 1 ? (
            <CheckIcon className="mx-auto h-5 w-5 text-dark-green" />
        ) : (
            <XMarkIcon className="mx-auto h-5 w-5 text-aktion-red" />
        );
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold text-dark-green">Pricing</h2>
                    <p className="mt-2 text-5xl font-semibold tracking-tight text-dark sm:text-6xl">
                        Wählen Sie Ihren Plan
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-dark">
                    Alle Pläne beinhalten unsere Kernfunktionen
                </p>

                {/* Mobile */}
                <div className="mx-auto mt-12 max-w-md space-y-8 sm:mt-16 lg:hidden">
                    {vertragsmodelle.map((tier) => (
                        <section
                            key={tier.name}
                            className={classNames(
                                tier.name === "Growth" ? 'rounded-xl bg-dark-6 ring-1 ring-inset ring-dark/20' : '',
                                'p-8'
                            )}
                        >
                            {tier.logoUrl ? (
                                <Image
                                    src={tier.logoUrl}
                                    alt={tier.name}
                                    width={100}
                                    height={100}
                                    style={{ width: '80px', height: '80px' }}
                                    className="mb-4 mx-auto"
                                />
                            ) : (
                                <div className="text-sm font-semibold text-dark mb-4">{tier.name}</div>
                            )}
                            <p className="mt-2 flex items-baseline gap-x-1">
                                <span className="text-4xl font-semibold text-dark">€{formatPrice(tier.preis)}</span>
                                <span className="text-sm font-semibold text-dark">/month</span>
                            </p>
                            <button
                                onClick={() => handleUpgrade(tier.name)}
                                disabled={loading === tier.name}
                                className={classNames(
                                    tier.name === "Growth"
                                        ? 'bg-dark-green text-white hover:bg-cta-green'
                                        : 'text-dark-green ring-1 ring-inset ring-dark-green hover:bg-dark-green hover:text-white',
                                    'mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors'
                                )}
                            >
                                {loading === tier.name ? "Wird verarbeitet..." : "Jetzt wählen"}
                            </button>
                            {/* Mobile Features List */}
                            <ul role="list" className="mt-10 space-y-4 text-sm text-dark">
                                {sortedFeatures.map((feature) => (
                                    <li key={feature.id} className="flex items-center justify-between gap-x-3">
                                        <span className="flex-1">{feature.name}</span>
                                        <div className="text-right">
                                            {renderFeatureValue(feature.tiers[tier.name], feature.typ)}
                                        </div>
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
                                    <div className="w-full rounded-t-xl border-x border-t border-dark/10 bg-dark-6" />
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
                                        {tier.logoUrl ? (
                                            <Image
                                                src={tier.logoUrl}
                                                alt={tier.name}
                                                width={100}
                                                height={100}
                                                style={{ width: '80px', height: '80px' }}
                                                className="mb-4 mx-auto"
                                            />
                                        ) : (
                                            <div className="text-sm font-semibold text-dark mb-4">{tier.name}</div>
                                        )}
                                        <div className="mt-4 flex items-baseline gap-x-1">
                                            <span className="text-4xl font-semibold text-dark">€{formatPrice(tier.preis)}</span>
                                            <span className="text-sm font-semibold text-dark">/month</span>
                                        </div>
                                        <button
                                            onClick={() => handleUpgrade(tier.name)}
                                            disabled={loading === tier.name}
                                            className={classNames(
                                                tier.name === "Growth"
                                                    ? 'bg-dark-green text-white hover:bg-cta-green'
                                                    : 'text-dark-green ring-1 ring-inset ring-dark-green hover:bg-dark-green hover:text-white',
                                                'mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors'
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
                                    <th scope="row" className="py-4 text-sm font-normal text-dark group relative">
                                        {feature.name}
                                        {feature.beschreibung && (
                                            <span className="invisible group-hover:visible absolute left-0 top-full mt-2 w-48 bg-dark text-white text-xs rounded p-2 z-10">
                                               {feature.beschreibung}
                                           </span>
                                        )}
                                        <div className="absolute inset-x-8 mt-4 h-px bg-dark/5" />
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