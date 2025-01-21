"use client";
import { Fragment } from "react";

const tiers = [
    { name: "Starter", id: "tier-starter", priceMonthly: "€0", mostPopular: false },
    { name: "Growth", id: "tier-growth", priceMonthly: "€24", mostPopular: true },
    { name: "Scale", id: "tier-scale", priceMonthly: "€34", mostPopular: false },
];

async function handleCheckout(productName: string) {
    try {
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productName }),
        });

        // Prüfe auf HTTP-Fehlerstatus
        if (!res.ok) {
            const errorData = await res.json();
            console.error("Fehler bei der Anfrage:", errorData);
            alert(`Fehler: ${errorData.error || "Unbekannter Fehler"}`);
            return;
        }

        // JSON-Antwort parsen
        const data = await res.json();
        console.log("API Response:", data);

        if (data.url) {
            // Weiterleitung zur Checkout-Session
            window.location.href = data.url;
        } else {
            console.error("Keine gültige URL erhalten:", data);
            alert(`Fehler: Keine gültige URL erhalten. Details: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        // Fange generelle Fehler ab
        console.error("Fehler beim Checkout:", error);
        alert("Ein technischer Fehler ist aufgetreten. Versuchen Sie es später erneut.");
    }
}

export default function PricingTable() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base/7 font-semibold text-dark-green">Pricing</h2>
                    <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-dark sm:text-6xl">
                        Pricing that grows with you
                    </p>
                </div>
                <div className="mx-auto mt-12 max-w-md space-y-8 sm:mt-16">
                    {tiers.map((tier) => (
                        <div key={tier.id} className="p-8 border rounded-xl">
                            <h3 className="text-sm font-semibold text-dark">{tier.name}</h3>
                            <p className="mt-2 text-4xl font-semibold text-dark">{tier.priceMonthly}</p>
                            <button
                                onClick={() => handleCheckout(tier.name)}
                                className="mt-8 bg-cta-green text-white px-4 py-2 rounded-md"
                            >
                                Buy plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}