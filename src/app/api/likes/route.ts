// src/app/api/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sanityClient from '@/lib/sanityClient';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('clubId');

    if (!clubId) {
        return NextResponse.json(
            { error: 'Club ID ist erforderlich' },
            { status: 400 }
        );
    }

    try {
        // Hole alle Likes für diesen Club
        const likes = await sanityClient.fetch(
            `*[_type == "like" && club._ref == $clubId]`,
            { clubId }
        );

        // Gib die Anzahl der Likes zurück
        return NextResponse.json({
            count: likes ? likes.length : 0
        });
    } catch (error) {
        console.error('Fehler beim Laden der Likes:', error);
        return NextResponse.json(
            { error: 'Fehler beim Laden der Likes', details: error instanceof Error ? error.message : 'Unbekannter Fehler' },
            { status: 500 }
        );
    }
}

// src/app/api/likes/route.ts
export async function POST(request: NextRequest) {
    try {
        // Parse den Anfrage-Body
        const requestBody = await request.json();
        console.log('Received request body:', requestBody);

        const { clubId, userId } = requestBody;

        // Validiere Eingabedaten
        if (!clubId) {
            console.error('Fehlende Club ID');
            return NextResponse.json(
                { error: 'Club ID ist erforderlich' },
                { status: 400 }
            );
        }

        if (!userId) {
            console.error('Fehlende Benutzer ID');
            return NextResponse.json(
                { error: 'Benutzer ID ist erforderlich' },
                { status: 400 }
            );
        }

        // Überprüfe, ob der Benutzer existiert
        const userExists = await sanityClient.fetch(
            `*[(_type == "user" || _type == "administrator") && _id == $userId][0]`,
            { userId }
        );

        if (!userExists) {
            console.error('Benutzer nicht gefunden:', userId);
            return NextResponse.json(
                { error: 'Benutzer nicht gefunden' },
                { status: 404 }
            );
        }

        // Überprüfe, ob der Club existiert
        const clubExists = await sanityClient.fetch(
            `*[_type == "golfclub" && _id == $clubId][0]`,
            { clubId }
        );

        if (!clubExists) {
            console.error('Club nicht gefunden:', clubId);
            return NextResponse.json(
                { error: 'Club nicht gefunden' },
                { status: 404 }
            );
        }

        // Suche nach einem existierenden Like
        const existingLike = await sanityClient.fetch(
            `*[_type == "like" && club._ref == $clubId && user._ref == $userId][0]`,
            { clubId, userId }
        );

        if (existingLike) {
            // Entferne den bestehenden Like
            await sanityClient.delete(existingLike._id);
            console.log('Like entfernt:', existingLike._id);
            return NextResponse.json({
                message: 'Like entfernt',
                action: 'removed'
            });
        }

        // Erstelle einen neuen Like
        const like = await sanityClient.create({
            _type: 'like',
            club: {
                _type: 'reference',
                _ref: clubId
            },
            user: {
                _type: 'reference',
                _ref: userId
            },
            createdAt: new Date().toISOString()
        });

        console.log('Neuer Like erstellt:', like._id);
        return NextResponse.json({
            message: 'Like hinzugefügt',
            action: 'added',
            like
        });

    } catch (error) {
        console.error('Unerwarteter Fehler:', error);
        return NextResponse.json(
            {
                error: 'Fehler bei der Datenbankoperation',
                details: error instanceof Error ? error.message : 'Unbekannter Fehler'
            },
            { status: 500 }
        );
    }
}