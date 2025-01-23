// src/app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import sanityClient from "@/lib/sanityClient";
import { sendInvoiceEmail } from "@/lib/email-templates/invoice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;


async function updateClubSubscription(subscription: Stripe.Subscription) {
    const clubId = subscription.metadata.clubId;

    await sanityClient.patch(clubId).set({
        subscriptionStatus: subscription.status,
        zahlungsStatus: subscription.status === 'active' ? 'aktiv' : 'ausstehend',
        vertragsBeginn: new Date(subscription.current_period_start * 1000).toISOString(),
        vertragsEnde: new Date(subscription.current_period_end * 1000).toISOString(),
    }).commit();
}

async function handleClubUpgrade(session: Stripe.Checkout.Session) {
    if (!session.metadata?.clubId) return;

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await sanityClient.patch(session.metadata.clubId).set({
        aktuellesModell: {
            _type: 'reference',
            _ref: session.metadata.planId
        },
        stripeCustomerId: session.customer as string,
        subscriptionId: session.subscription,
        subscriptionStatus: subscription.status,
        zahlungsStatus: 'aktiv'
    }).commit();
}

async function handleInvoiceCreated(invoice: Stripe.Invoice) {
    if (!invoice.customer) return;

    const club = await sanityClient.fetch(
        `*[_type == "golfclub" && stripeCustomerId == $customerId][0]{
            title,
            hauptAdmin->{email}
        }`,
        { customerId: invoice.customer }
    );

    if (club && club.hauptAdmin?.email) {
        await sendInvoiceEmail({
            to: club.hauptAdmin.email,
            clubName: club.title,
            invoiceNumber: invoice.number!,
            amount: invoice.amount_due,
            downloadUrl: invoice.invoice_pdf!
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'No stripe signature found' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Webhook signature verification failed' },
                { status: 400 }
            );
        }

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleClubUpgrade(session);
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await updateClubSubscription(subscription);
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                if (invoice.subscription) {
                    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
                    await updateClubSubscription(subscription);
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const clubId = invoice.metadata?.clubId;

                if (clubId) {
                    await sanityClient.patch(clubId).set({
                        zahlungsStatus: 'ausstehend'
                    }).commit();
                }
                break;
            }

            case 'invoice.created': {
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoiceCreated(invoice);
                break;
            }
        }


        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }

}



