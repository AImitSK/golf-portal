// src/app/api/cron/stripe-sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import sanityClient from "@/lib/sanityClient";

export const runtime = 'edge';
const cronSecret = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // Fetch all clubs with Stripe subscriptions
        const clubs = await sanityClient.fetch(`
            *[_type == "golfclub" && defined(stripeCustomerId)]{
                _id,
                stripeCustomerId,
                subscriptionId
            }
        `);

        for (const club of clubs) {
            // Get current subscription status
            if (club.subscriptionId) {
                const subscription = await stripe.subscriptions.retrieve(club.subscriptionId);

                await sanityClient.patch(club._id).set({
                    subscriptionStatus: subscription.status,
                    zahlungsStatus: subscription.status === 'active' ? 'aktiv' : 'ausstehend',
                    vertragsBeginn: new Date(subscription.current_period_start * 1000).toISOString(),
                    vertragsEnde: new Date(subscription.current_period_end * 1000).toISOString(),
                }).commit();
            }
        }

        return NextResponse.json({ success: true, synced: clubs.length });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}