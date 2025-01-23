// src/components/frontend-ui/PricingTable.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const tiers = [
    {
        name: "Starter",
        id: "tier-starter",
        priceMonthly: "€0",
        features: ["5 Golfclub-Einträge", "Basis Support", "Standard Listing"],
        mostPopular: false
    },
    {
        name: "Growth",
        id: "tier-growth",
        priceMonthly: "€24",
        features: ["Unbegrenzte Einträge", "Priority Support", "Featured Listing"],
        mostPopular: true
    },
    {
        name: "Scale",
        id: "tier-scale",
        priceMonthly: "€34",
        features: ["Alles aus Growth", "24/7 Support", "Premium Listing", "API Zugang"],
        mostPopular: false
    }
];

export default function PricingTable() {
    const { data: session  } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    async function handleCheckout(productName: string) {
        if (!session) {
            router.push("/auth/login?callbackUrl=/pricing");
            return;
        }

        setLoading(productName);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Checkout fehlgeschlagen");
            }

            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Checkout fehlgeschlagen. Bitte versuchen Sie es später erneut.");
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold text-dark-green">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Passend für jeden Club
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3 lg:gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`flex flex-col rounded-3xl p-8 ring-1 ring-gray-200 ${
                                tier.mostPopular ? "bg-gray-100" : ""
                            }`}
                        >
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {tier.name}
                                </h3>
                                <p className="mt-4 text-3xl font-bold text-gray-900">
                                    {tier.priceMonthly}
                                </p>
                                <p className="mt-2 text-sm text-gray-500">pro Monat</p>
                            </div>

                            <ul className="mb-8 space-y-4 text-sm">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <svg
                                            className="h-5 w-5 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="ml-3">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(tier.name)}
                                disabled={loading === tier.name}
                                className={`mt-auto rounded-md bg-[#006633] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#2CDB48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006633] ${
                                    loading === tier.name ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                {loading === tier.name ? "Wird geladen..." : "Auswählen"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}