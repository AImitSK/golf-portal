// src/app/api/subscription/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import sanityClient from "@/lib/sanityClient";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const club = await sanityClient.fetch(`
            *[_type == "golfclub" && hauptAdmin->email == $email][0]{
                aktuellesModell->{name},
                subscriptionStatus,
                vertragsEnde
            }
        `, { email: session.user.email });

        if (!club) {
            return NextResponse.json({ error: "Club not found" }, { status: 404 });
        }

        return NextResponse.json({
            status: club.subscriptionStatus || 'inactive',
            planName: club.aktuellesModell?.name || 'Starter',
            validUntil: club.vertragsEnde
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch subscription status" },
            { status: 500 }
        );
    }
}