//src/app/api/wishlist/route.ts
import { auth } from "@/auth"
import sanityClient from "@/lib/sanityClient"
import { NextRequest, NextResponse } from "next/server"

// In /api/wishlist/route.ts
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse(
                JSON.stringify({ message: "Nicht eingeloggt" }),
                {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        const body = await request.json();
        const { clubId } = body;

        if (!clubId) {
            return new NextResponse(
                JSON.stringify({ message: "Club ID fehlt" }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Prüfe ob der Eintrag bereits existiert
        const existingEntry = await sanityClient.fetch(
            `*[_type == "wishlist" && user._ref == $userId && club._ref == $clubId][0]`,
            {
                userId: session.user._id,
                clubId
            }
        );

        if (existingEntry) {
            return NextResponse.json({
                message: "Club ist bereits auf der Wunschliste"
            });
        }

        // Erstelle einen neuen Wishlist-Eintrag
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
        };

        const response = await sanityClient.create(wishlistEntry);

        return NextResponse.json({
            message: "Erfolgreich zur Wunschliste hinzugefügt",
            entry: response
        });

    } catch (error) {
        console.error('[WISHLIST_POST]', error);
        return new NextResponse(
            JSON.stringify({ message: "Ein Fehler ist aufgetreten" }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
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