//src/app/api/wishlist/route.ts
import { auth } from "@/auth"
import sanityClient from "@/lib/sanityClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        // Check für Auth
        if (!session || !session.user || !session.user._id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Body parsen
        let body;
        try {
            body = await req.json()
        } catch (e) {
            return new NextResponse("Invalid JSON", { status: 400 })
        }

        const { clubId } = body
        if (!clubId) {
            return new NextResponse("Club ID is required", { status: 400 })
        }

        // Wishlist Entry erstellen
        const wishlistEntry = {
            _type: 'wishlist',
            user: {
                _type: 'reference',
                _ref: session.user._id
            },
            club: {
                _type: 'reference',
                _ref: clubId
            },
            createdAt: new Date().toISOString()
        }

        const response = await sanityClient.create(wishlistEntry)
        return NextResponse.json(response)

    } catch (error) {
        console.error('[WISHLIST_POST]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth()

        // Check für Auth
        if (!session || !session.user || !session.user._id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // ID aus der URL holen
        const entryId = req.nextUrl.searchParams.get('id')
        if (!entryId) {
            return new NextResponse("Entry ID is required", { status: 400 })
        }

        // Entry löschen
        await sanityClient.delete(entryId)
        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[WISHLIST_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// Optional: GET Route für das Abrufen der Wunschliste
export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        // Check für Auth
        if (!session || !session.user || !session.user._id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Wishlist abrufen
        const wishlist = await sanityClient.fetch(
            `*[_type == "wishlist" && user._ref == $userId]{
                _id,
                createdAt,
                "club": club->{
                    _id,
                    title,
                    "slug": slug.current
                }
            }`,
            { userId: session.user._id }
        )

        return NextResponse.json(wishlist)

    } catch (error) {
        console.error('[WISHLIST_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}