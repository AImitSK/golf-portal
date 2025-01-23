// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import sanityClient from "@/lib/sanityClient";

// GET für das Laden der Profildaten
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Hole User mit Heimatclub-Referenz
        const user = await sanityClient.fetch(`
            *[_type == "user" && _id == $userId][0]{
                _id,
                name,
                email,
                "image": image.asset->url,
                heimatclub->{
                    _id,
                    title
                }
            }
        `, { userId: session.user._id });

        return NextResponse.json(user);

    } catch (error) {
        console.error('[PROFILE_GET]', error);
        return new NextResponse(
            "Internal Error",
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
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
            const imageAsset = await sanityClient.assets.upload('image', image);
            updates.image = {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: imageAsset._id
                }
            };
        }

        // Update in Sanity
        const updatedUser = await sanityClient
            .patch(session.user._id)
            .set(updates)
            .commit();

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('[PROFILE_PATCH]', error);
        return new NextResponse(
            "Internal Error",
            { status: 500 }
        );
    }
}