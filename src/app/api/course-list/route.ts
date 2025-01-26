// src/app/api/course-list/route.ts
import { auth } from '@/auth';
import sanityClient from '@/lib/sanityClient';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new Response(JSON.stringify({ message: 'Nicht autorisiert' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { clubId } = await request.json();
        const existingEntry = await sanityClient.fetch(
            `*[_type == "coursePlayed" && user._ref == $userId && club._ref == $clubId][0]`,
            { userId: session.user._id, clubId }
        );

        if (existingEntry) {
            return new Response(JSON.stringify({ message: 'Bereits in der Liste' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await sanityClient.create({
            _type: 'coursePlayed',
            user: { _type: 'reference', _ref: session.user._id },
            club: { _type: 'reference', _ref: clubId },
            plays: [],
            createdAt: new Date().toISOString()
        });

        return new Response(JSON.stringify({ message: 'Erfolgreich hinzugefügt' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch {
        return new Response(JSON.stringify({ message: 'Ein Fehler ist aufgetreten' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}