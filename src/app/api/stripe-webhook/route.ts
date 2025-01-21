import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15", // Unterstützte API-Version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const sig = req.headers.get('stripe-signature')!;

        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
        } catch (err: any) {
            console.error('Webhook-Fehler:', err.message);
            return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
        }

        switch (event.type) {
            case 'checkout.session.completed':
                console.log('✅ Zahlung erfolgreich:', event.data.object);
                break;
            case 'invoice.payment_succeeded':
                console.log('✅ Rechnung bezahlt:', event.data.object);
                break;
            case 'customer.subscription.deleted':
                console.log('❌ Abo gekündigt:', event.data.object);
                break;
            default:
                console.warn(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook-Fehler:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}