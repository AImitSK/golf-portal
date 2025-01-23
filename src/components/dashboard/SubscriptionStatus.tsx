// src/components/dashboard/SubscriptionStatus.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Crown, AlertTriangle } from "lucide-react";

interface SubscriptionInfo {
    status: string;
    planName: string;
    validUntil: string;
}

export default function SubscriptionStatus() {
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

    useEffect(() => {
        async function fetchStatus() {
            const res = await fetch('/api/subscription/status');
            if (res.ok) {
                const data = await res.json();
                setSubscription(data);
            }
        }
        fetchStatus();
    }, []);

    if (!subscription) return null;

    const isActive = subscription.status === 'active';

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {isActive ? (
                        <Crown className="h-8 w-8 text-green-500" />
                    ) : (
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    )}
                    <div>
                        <h3 className="font-medium">{subscription.planName}</h3>
                        <p className="text-sm text-gray-500">
                            {isActive
                                ? `Gültig bis ${new Date(subscription.validUntil).toLocaleDateString()}`
                                : 'Subscription inaktiv'
                            }
                        </p>
                    </div>
                </div>
                {!isActive && (
                    <a
                        href="/pricing"
                        className="bg-[#006633] text-white px-4 py-2 rounded-md text-sm"
                    >
                        Plan upgraden
                    </a>
                )}
            </div>
        </Card>
    );
}