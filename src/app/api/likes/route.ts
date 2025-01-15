// src/app/api/likes/route.ts
import { NextResponse } from 'next/server';
import sanityClient from '@/lib/sanityClient';

export async function POST(req: Request) {
    try {
        const { clubId, userId } = await req.json();

        if (!clubId || !userId) {
            return NextResponse.json(
                { error: 'Club ID and User ID are required' },
                { status: 400 }
            );
        }

        console.log('Incoming Like Request:', { clubId, userId }); // Debugging-Log

        try {
            // Prüfen ob Like bereits existiert
            const existingLike = await sanityClient.fetch(
                `*[_type == "like" && club._ref == $clubId && user._ref == $userId][0]`,
                { clubId, userId }
            );

            if (existingLike) {
                // Like entfernen
                await sanityClient.delete(existingLike._id);
                return NextResponse.json({ message: 'Like removed' });
            }

            // Neuen Like erstellen
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

            return NextResponse.json({ message: 'Like added', like });
        } catch (sanityError) {
            console.error('Sanity Error:', sanityError);
            return NextResponse.json(
                { error: 'Sanity operation failed', details: sanityError.message },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Full Error:', error);
        return NextResponse.json(
            { error: 'Failed to manage like', details: error.message },
            { status: 500 }
        );
    }
}