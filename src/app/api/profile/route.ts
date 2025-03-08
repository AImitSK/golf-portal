// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import sanityClient from "@/lib/sanityClient";

// GET für das Laden der Profildaten
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Erweiterte Abfrage für das Bild
        const user = await sanityClient.fetch(`
            *[_type == "user" && _id == $userId][0]{
                _id,
                name,
                email,
                image,
                heimatclub->{
                    _id,
                    title
                },
                handicapIndex,
                handicapHistory
            }
        `, { userId: session.user._id });

        console.log("Abgerufene Profildaten:", JSON.stringify(user, null, 2));

        return NextResponse.json(user);
    } catch (error) {
        console.error('[PROFILE_GET]', error);
        return new NextResponse(
            JSON.stringify({ error: "Internal Error" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const formData = await request.formData();

        const updates: any = {};

        // Name
        const name = formData.get('name');
        if (name) updates.name = name;

        // Email
        const email = formData.get('email');
        if (email) updates.email = email;

        // Heimatclub
        const heimatclub = formData.get('heimatclub');
        if (heimatclub) {
            updates.heimatclub = {
                _type: 'reference',
                _ref: heimatclub
            };
        }

        // Profilbild
        const image = formData.get('image');
        if (image instanceof File) {
            try {
                // Hochladen als Asset
                const imageAsset = await sanityClient.assets.upload('image', image);

                // Als vollständige Referenz speichern
                updates.image = {
                    _type: 'image',
                    asset: {
                        _type: "reference",
                        _ref: imageAsset._id
                    }
                };
            } catch (uploadError) {
                console.error('[IMAGE_UPLOAD_ERROR]', uploadError);
                return new NextResponse(
                    JSON.stringify({ error: "Fehler beim Hochladen des Bildes" }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        try {
            // Update in Sanity
            const updatedUser = await sanityClient
                .patch(session.user._id)
                .set(updates)
                .commit();

            return NextResponse.json(updatedUser);
        } catch (patchError) {
            console.error('[PATCH_ERROR]', patchError);
            // Detaillierte Fehlermeldung zurückgeben
            const errorMessage = patchError instanceof Error
                ? patchError.message
                : "Fehler beim Aktualisieren des Profils";

            return new NextResponse(
                JSON.stringify({ error: errorMessage }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

    } catch (error) {
        console.error('[PROFILE_PATCH]', error);
        return new NextResponse(
            JSON.stringify({ error: "Internal Error" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}