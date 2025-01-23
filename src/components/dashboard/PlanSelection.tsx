// src/components/dashboard/PlanSelection.tsx
"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "€0",
        features: ["5 Golfclub-Einträge", "Basis Support", "Standard Listing"]
    },
    {
        name: "Growth",
        price: "€24",
        features: ["Unbegrenzte Einträge", "Priority Support", "Featured Listing"]
    },
    {
        name: "Scale",
        price: "€34",
        features: ["Alles aus Growth", "24/7 Support", "Premium Listing", "API Zugang"]
    }
];

export default function PlanSelection() {
    const [loading, setLoading] = useState<string | null>(null);

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
        } catch (error) {
            alert('Plan-Upgrade fehlgeschlagen. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
                <div
                    key={plan.name}
                    className="relative border rounded-lg p-6 bg-white"
                >
                    <h3 className="text-lg font-medium">{plan.name}</h3>
                    <p className="mt-2 text-2xl font-bold">{plan.price}</p>
                    <p className="text-sm text-gray-500">pro Monat</p>

                    <ul className="mt-6 space-y-4">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span className="ml-3 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleUpgrade(plan.name)}
                        disabled={loading === plan.name}
                        className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#006633] hover:bg-[#2CDB48] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006633] disabled:opacity-50"
                    >
                        {loading === plan.name ? (
                            "Wird verarbeitet..."
                        ) : (
                            <>
                                Plan auswählen
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
}