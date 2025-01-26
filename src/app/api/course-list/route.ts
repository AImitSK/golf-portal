// src/app/api/course-list/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import sanityClient from '@/lib/sanityClient';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { clubId } = await request.json();

        // Prüfen ob der Club bereits in der Course List ist
        const existingEntry = await sanityClient.fetch(
            `*[_type == "coursePlayed" && user._ref == $userId && club._ref == $clubId][0]`,
            { userId: session.user._id, clubId }
        );

        if (existingEntry) {
            return new NextResponse('Club already in course list', { status: 400 });
        }

        // Neuen Eintrag erstellen
        const entry = await sanityClient.create({
            _type: 'coursePlayed',
            user: {
                _type: 'reference',
                _ref: session.user._id
            },
            club: {
                _type: 'reference',
                _ref: clubId
            },
            plays: [],
            createdAt: new Date().toISOString()
        });

        return NextResponse.json(entry);
    } catch (error) {
        console.error('Error adding to course list:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}