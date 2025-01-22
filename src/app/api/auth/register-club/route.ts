// src/app/api/auth/register-club/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { nanoid } from 'nanoid';
import { ClubRegisterSchema } from "@/types/schemas/auth-schemas";
import sanityClient from "@/lib/sanityClient";
import { stripe } from "@/lib/stripe";
import type { SanityDocument } from '@sanity/types';

// Typen für API Response
interface ApiResponse {
    success?: boolean;
    error?: string;
    clubId?: string;
    message?: string;
    details?: Record<string, unknown>;
}

// Typen für Sanity Dokumente
interface AdminDocument extends SanityDocument {
    _type: "administrator";
    name: string;
    email: string;
    password: string;
    position: string;
    role: string;
    permissions: string[];
    aktiv: boolean;
    createdAt: string;
}

interface ClubDocument extends SanityDocument {
    _type: "golfclub";
    title: string;
    slug: {
        current: string;
    };
    beschreibung: string;
    clubEmail: string;
    clubWebsite?: string;
    clubTelefon?: string;
    adresse: {
        strasse: string;
        hausnummer: string;
        plz: string;
        ort: string;
    };
    hauptAdmin: {
        _type: "reference";
        _ref: string;
    };
    aktuellesModell: {
        _type: "reference";
        _ref: string;
    };
    stripeCustomerId: string;
    status: string;
    subscriptionStatus: string;
    zahlungsStatus: string;
    vertragsBeginn: string;
    claimToken: string;
    isClaimed: boolean;
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        // 1. Request Body parsen und validieren
        const body = await req.json();
        const validationResult = ClubRegisterSchema.safeParse(body);

        if (!validationResult.success) {
            console.error("Validation failed:", validationResult.error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Validierung fehlgeschlagen",
                    details: validationResult.error.flatten()
                },
                { status: 400 }
            );
        }

        const { admin, club, adresse } = validationResult.data;

        // 2. Prüfen ob Club oder Admin bereits existiert
        const [existingClub, existingAdmin] = await Promise.all([
            sanityClient.fetch<ClubDocument | null>(
                `*[_type == "golfclub" && (title == $clubName || clubEmail == $clubEmail)][0]`,
                { clubName: club.name, clubEmail: club.email }
            ),
            sanityClient.fetch<AdminDocument | null>(
                `*[_type == "administrator" && email == $email][0]`,
                { email: admin.email }
            )
        ]);

        if (existingClub) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Ein Club mit diesem Namen oder dieser E-Mail existiert bereits"
                },
                { status: 400 }
            );
        }

        if (existingAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Diese E-Mail-Adresse wird bereits verwendet"
                },
                { status: 400 }
            );
        }

        // 3. Stripe Customer erstellen
        let stripeCustomer;
        try {
            stripeCustomer = await stripe.customers.create({
                email: club.email,
                name: club.name,
                metadata: {
                    clubName: club.name,
                    adminEmail: admin.email
                }
            });
        } catch (stripeError) {
            console.error("Stripe customer creation failed:", stripeError);
            throw new Error("Stripe Kunde konnte nicht erstellt werden");
        }

        // 4. Admin Passwort hashen
        const hashedPassword = await hash(admin.password, 10);

        // 5. Starter Plan ID abrufen
        const starterPlan = await sanityClient.fetch<{ _id: string } | null>(
            `*[_type == "vertragsmodell" && name == "Starter"][0]`
        );

        if (!starterPlan) {
            throw new Error("Starter Plan nicht gefunden");
        }

        // 6. Transaktion: Administrator und Club erstellen
        try {
            // Administrator erstellen
            const newAdmin = await sanityClient.create({
                _type: "administrator" as const,
                name: admin.name,
                email: admin.email,
                password: hashedPassword,
                position: admin.position,
                role: "club_admin",
                permissions: ["edit_club_profile", "manage_members", "view_analytics"],
                aktiv: true,
                createdAt: new Date().toISOString()
            });

            // Golf Club erstellen
            const newClub = await sanityClient.create({
                _type: "golfclub" as const,
                title: club.name,
                slug: {
                    current: club.name.toLowerCase().replace(/\s+/g, "-")
                },
                beschreibung: "",
                clubEmail: club.email,
                clubWebsite: club.website,
                clubTelefon: club.telefon,
                adresse: {
                    strasse: adresse.strasse,
                    hausnummer: adresse.hausnummer,
                    plz: adresse.plz,
                    ort: adresse.ort
                },
                hauptAdmin: {
                    _type: "reference",
                    _ref: newAdmin._id
                },
                aktuellesModell: {
                    _type: "reference",
                    _ref: starterPlan._id
                },
                stripeCustomerId: stripeCustomer.id,
                status: "published",
                subscriptionStatus: "active",
                zahlungsStatus: "aktiv",
                vertragsBeginn: new Date().toISOString(),
                claimToken: nanoid(),
                isClaimed: true
            });

            return NextResponse.json({
                success: true,
                clubId: newClub._id,
                message: "Club erfolgreich registriert"
            });

        } catch (error) {
            // Bei Fehler: Stripe Customer löschen
            if (stripeCustomer?.id) {
                try {
                    await stripe.customers.del(stripeCustomer.id);
                } catch (deleteError) {
                    console.error("Failed to delete Stripe customer:", deleteError);
                }
            }
            throw error;
        }

    } catch (error) {
        console.error("Registration error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten"
            },
            { status: 500 }
        );
    }
}