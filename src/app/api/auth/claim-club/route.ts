// src/app/api/auth/claim-club/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { ClaimClubSchema } from "@/types/schemas/auth-schemas";
import sanityClient from "@/lib/sanityClient";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    try {
        // Request Body validieren
        const body = await req.json();
        const validationResult = ClaimClubSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validierung fehlgeschlagen",
                    details: validationResult.error.flatten()
                },
                { status: 400 }
            );
        }

        const { admin, claim } = validationResult.data;

        // 1. Club abrufen und prüfen
        const club = await sanityClient.fetch(
            `*[_type == "golfclub" && _id == $clubId && !isClaimed][0]`,
            { clubId: claim.clubId }
        );

        if (!club) {
            return NextResponse.json(
                { error: "Club nicht gefunden oder bereits beansprucht" },
                { status: 404 }
            );
        }

        // 2. Email-Domain Verifikation
        const clubDomain = club.clubEmail.split('@')[1];
        const adminDomain = admin.email.split('@')[1];

        if (clubDomain !== adminDomain) {
            return NextResponse.json(
                { error: "Die Email-Adresse muss zur Club-Domain gehören" },
                { status: 400 }
            );
        }

        // 3. Stripe Customer aktualisieren/erstellen
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

        // 4. Admin erstellen
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

        // 5. Club updaten
        await sanityClient.patch(club._id).set({
            hauptAdmin: {
                _type: "reference",
                _ref: newAdmin._id
            },
            isClaimed: true,
            stripeCustomerId: stripeCustomer.id
        }).commit();

        return NextResponse.json({
            success: true,
            clubId: club._id,
            message: "Club erfolgreich übernommen"
        });

    } catch (error) {
        console.error("Claim error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
            },
            { status: 500 }
        );
    }
}