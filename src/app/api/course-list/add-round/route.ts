// src/app/api/course-list/add-round/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/sanity/getUser';
import sanityClient from '@/lib/sanityClient';
import { Hole } from '@/types/golf-course';

export async function POST(request: NextRequest) {
    try {
        // Holen Sie die Benutzer-ID aus dem Header
        const userIdFromHeader = request.headers.get('X-User-ID');

        if (!userIdFromHeader) {
            return NextResponse.json({ message: 'Nicht autorisiert' }, { status: 401 });
        }

        // Überprüfen Sie den Benutzer
        const user = await getUserById(userIdFromHeader);

        if (!user) {
            return NextResponse.json({ message: 'Benutzer nicht gefunden' }, { status: 401 });
        }

        const data = await request.json();
        console.log('Received data:', data);

        const newPlay = {
            _type: 'play',
            _key: new Date().toISOString(),
            date: new Date().toISOString(),
            score: data.totalGross,
            stableford: data.totalStableford,
            netScore: data.totalNet,
            playedTee: {
                name: data.tee.name,
                color: data.tee.color,
                courseRating: data.tee.courseRating,
                slopeRating: data.tee.slopeRating,
                par: data.tee.par
            },
            holeScores: data.tee.holes.map((hole: Hole, index: number) => ({
                number: hole.number,
                par: hole.par,
                score: data.scores[index],
                netScore: data.scores[index],
                stableford: 0
            }))
        };

        // Suchen Sie den existierenden CoursePlayed Eintrag
        const existingCoursePlayed = await sanityClient.fetch(
            `*[_type == "coursePlayed" && user._ref == $userId && club._ref == $courseId][0]`,
            { userId: userIdFromHeader, courseId: data.courseId }
        );

        if (existingCoursePlayed) {
            await sanityClient
                .patch(existingCoursePlayed._id)
                .setIfMissing({ plays: [] })
                .append('plays', [newPlay])
                .commit();
        } else {
            await sanityClient.create({
                _type: 'coursePlayed',
                user: { _type: 'reference', _ref: userIdFromHeader },
                club: { _type: 'reference', _ref: data.courseId },
                plays: [newPlay],
                createdAt: new Date().toISOString()
            });
        }

        return NextResponse.json({ message: 'Runde erfolgreich gespeichert' }, { status: 200 });

    } catch (error) {
        console.error('Detailed error saving round:', error);
        return NextResponse.json({
            message: 'Fehler beim Speichern der Runde',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}