// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import sanityClient from "@/lib/sanityClient";
import { sendPlanUpdateEmail } from "@/lib/email-templates/plan-update";

const plans = {
    Scale: {
        productId: "prod_Rdyij4rPzbM814",
        priceId: "price_1QkgkzCrzNkrNAuisLkpgvLj",
        amount: 3900
    },
    Growth: {
        productId: "prod_RdyfUwm5N7cHVQ",
        priceId: "price_1QkghhCrzNkrNAuiMW8vsZTs",
        amount: 2900
    },
    Starter: {
        productId: "prod_RdybuBmxa6bmA6",
        priceId: "price_1Qkge7CrzNkrNAuiKn7vsnIV",
        amount: 0
    }
} as const;

type PlanType = keyof typeof plans;

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
        }

        const body = await req.json();
        const planName = body.productName as PlanType;

        if (!planName || !plans[planName]) {
            return NextResponse.json({ error: "Ungültiger Plan" }, { status: 400 });
        }

        const club = await sanityClient.fetch(
            `*[_type == "golfclub" && hauptAdmin->email == $email][0]{
               _id,
               title,
               stripeCustomerId
           }`,
            { email: session.user.email }
        );

        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: plans[planName].priceId,
                    quantity: 1
                }
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_URL}/club-backend?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
            customer: club?.stripeCustomerId || undefined,
            metadata: {
                clubId: club?._id,
                planId: plans[planName].productId,
                planName
            },
            subscription_data: {
                metadata: {
                    clubId: club?._id,
                    planName
                }
            }
        });

        if (!checkoutSession.url) {
            throw new Error("Keine Checkout URL erhalten");
        }

        // Send email notification
        if (club) {
            await sendPlanUpdateEmail({
                to: session.user.email,
                clubName: club.title,
                planName,
                amount: plans[planName].amount,
                startDate: new Date()
            });
        }

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Checkout fehlgeschlagen" }, { status: 500 });
    }
}