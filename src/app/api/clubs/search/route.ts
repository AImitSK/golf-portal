// src/app/api/clubs/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import sanityClient from "@/lib/sanityClient";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const term = searchParams.get("term");

        if (!term) {
            return NextResponse.json({ clubs: [] });
        }

        // Suche nach Clubs die:
        // - nicht beansprucht sind (isClaimed: false)
        // - Namen ähnlich dem Suchbegriff haben
        // - oder die Stadt/PLZ ähnlich dem Suchbegriff haben
        const query = `*[_type == "golfclub" && !isClaimed && (
            title match $term + "*" || 
            adresse.ort match $term + "*" ||
            adresse.plz match $term + "*"
        )] {
            _id,
            title,
            clubEmail,
            adresse,
            claimToken
        }`;

        const clubs = await sanityClient.fetch(query, {
            term: term
        });

        return NextResponse.json({
            clubs: clubs.map((club: any) => ({
                _id: club._id,
                title: club.title,
                clubEmail: club.clubEmail,
                adresse: {
                    ort: club.adresse?.ort || ''
                }
            }))
        });

    } catch (error) {
        console.error("Club search error:", error);
        return NextResponse.json(
            { error: "Fehler bei der Suche" },
            { status: 500 }
        );
    }
}