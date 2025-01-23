// src/app/api/clubs/route.ts
import { NextResponse } from 'next/server';
import sanityClient from "@/lib/sanityClient";

export async function GET() {
    try {
        const clubs = await sanityClient.fetch(`
            *[_type == "golfclub" && status == "published"] {
                _id,
                title,
                slug
            }
        `);

        return NextResponse.json(clubs);
    } catch (error) {
        console.error('[CLUBS_GET]', error);
        return new NextResponse(
            "Internal Error",
            { status: 500 }
        );
    }
}