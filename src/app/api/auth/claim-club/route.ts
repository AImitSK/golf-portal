// src/app/api/auth/claim-club/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { ClaimClubSchema } from "@/types/schemas/auth-schemas";
import sanityClient from "@/lib/sanityClient";
import { stripe } from "@/lib/stripe";
import { sendClaimConfirmationEmail } from "@/lib/sendgrid";

export async function POST(req: NextRequest) {
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    try {
        const body = await req.json();
        const validationResult = ClaimClubSchema.safeParse(body);

        if (!validationResult.success) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    error: "Validierung fehlgeschlagen",
                    details: validationResult.error.flatten()
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { admin, claim } = validationResult.data;

        const clubId = claim.clubId;
        const query = `*[_type == "golfclub" && _id == $clubId]{
            _id,
            title,
            clubEmail,
            isClaimed
        }[0]`;

        const club = await sanityClient.fetch(query, { clubId });

        if (!club) {
            return new NextResponse(
                JSON.stringify({ error: "Club nicht gefunden oder bereits beansprucht" }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const clubDomain = club.clubEmail.split('@')[1];
        const adminDomain = admin.email.split('@')[1];

        if (clubDomain !== adminDomain) {
            return new NextResponse(
                JSON.stringify({ error: "Die Email-Adresse muss zur Club-Domain gehören" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        let stripeCustomer;
        try {
            if (club.stripeCustomerId) {
                stripeCustomer = await stripe.customers.retrieve(club.stripeCustomerId);
            } else {
                stripeCustomer = await stripe.customers.create({
                    email: admin.email,
                    name: club.title,
                    metadata: {
                        clubId: club._id,
                        clubName: club.title,
                        adminEmail: admin.email
                    }
                });
            }
        } catch (stripeError) {
            console.error("Stripe error:", stripeError);
            throw new Error("Fehler bei der Stripe Integration");
        }

        const hashedPassword = await hash(admin.password, 10);
        const newAdmin = await sanityClient.create({
            _type: "administrator",
            name: admin.name,
            email: admin.email,
            password: hashedPassword,
            position: admin.position,
            role: "club_admin",
            permissions: ["edit_club_profile", "manage_members", "view_analytics"],
            aktiv: true,
            createdAt: new Date().toISOString()
        });

        // Claim Log erstellen
        await sanityClient.create({
            _type: 'claimLog',
            club: { _type: 'reference', _ref: club._id },
            admin: { _type: 'reference', _ref: newAdmin._id },
            claimedAt: new Date().toISOString(),
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
        });

        // Club updaten
        await sanityClient.patch(club._id).set({
            hauptAdmin: { _type: "reference", _ref: newAdmin._id },
            isClaimed: true,
            stripeCustomerId: stripeCustomer.id
        }).commit();

        // Email senden
        try {
            await sendClaimConfirmationEmail({
                to: admin.email,
                clubName: club.title,
                adminName: admin.name
            });
        } catch (emailError) {
            console.error("Email error:", emailError);
            // Fehler beim Email-Versand loggen, aber Prozess fortsetzen
        }

        return new NextResponse(
            JSON.stringify({
                success: true,
                clubId: club._id,
                message: "Club erfolgreich übernommen"
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error("Claim error:", error);
        return new NextResponse(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}