// src/app/api/invoices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import sanityClient from "@/lib/sanityClient";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const club = await sanityClient.fetch(
            `*[_type == "golfclub" && hauptAdmin->email == $email][0]{
                stripeCustomerId
            }`,
            { email: session.user.email }
        );

        if (!club?.stripeCustomerId) {
            return NextResponse.json({ error: "No stripe customer found" }, { status: 404 });
        }

        const invoices = await stripe.invoices.list({
            customer: club.stripeCustomerId,
            limit: 24, // Letzte 24 Rechnungen
        });

        const formattedInvoices = invoices.data.map(invoice => ({
            id: invoice.id,
            number: invoice.number,
            amount: invoice.amount_paid,
            status: invoice.status,
            date: new Date(invoice.created * 1000).toISOString(),
            url: invoice.invoice_pdf
        }));

        return NextResponse.json(formattedInvoices);
    } catch (error) {
        console.error('Failed to fetch invoices:', error);
        return NextResponse.json(
            { error: "Failed to fetch invoices" },
            { status: 500 }
        );
    }
}