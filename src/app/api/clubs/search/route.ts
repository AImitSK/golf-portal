// src/app/api/clubs/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import sanityClient from "@/lib/sanityClient";
import { searchGolfClubs } from "@/lib/sanity/getGolfClubs";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const term = searchParams.get("term");

        if (!term || term.length < 2) {
            return NextResponse.json({ clubs: [] });
        }

        const clubs = await searchGolfClubs(term);
        console.log("Search results:", clubs); // Debug-Log

        return NextResponse.json({ clubs });

    } catch (error) {
        console.error("Club search error:", error);
        return NextResponse.json(
            { error: "Fehler bei der Suche" },
            { status: 500 }
        );
    }
}