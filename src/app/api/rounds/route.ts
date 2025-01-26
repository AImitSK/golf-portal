// src/app/api/rounds/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import sanityClient from "@/lib/sanityClient";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const {
            userId,
            courseId,
            tee,
            scores,
            totalGross,
            totalNet,
            totalStableford,
            playerHandicap,
            courseHandicap,
            date,
            weather,
            notes,
        } = data;

        // Validierung der Pflichtfelder
        if (
            !userId ||
            !courseId ||
            !tee ||
            !scores ||
            totalGross === undefined ||
            totalNet === undefined ||
            totalStableford === undefined ||
            !playerHandicap ||
            !courseHandicap ||
            !date
        ) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validiere User-ID
        if (session.user._id !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Validiere Tee-Daten
        if (!Array.isArray(tee.holes) || tee.holes.length !== scores.length) {
            return NextResponse.json({ error: 'Invalid tee or scores data' }, { status: 400 });
        }

        // Erstelle die Hole-Scores
        const holeScores = scores.map((score: number, index: number) => ({
            number: index + 1,
            par: tee.holes[index].par,
            score: score,
            netScore: data.netScores?.[index] || null,
            stableford: data.stablefordScores?.[index] || null,
        }));

        // Erstelle die Runde in Sanity
        const playedRound = await sanityClient.create({
            _type: 'playedRound',
            user: { _type: 'reference', _ref: userId },
            course: { _type: 'reference', _ref: courseId },
            playedTee: {
                name: tee.name,
                color: tee.color,
                courseRating: tee.courseRating,
                slopeRating: tee.slopeRating,
                par: tee.par,
            },
            playerHandicap,
            courseHandicap,
            date,
            holeScores,
            totals: { gross: totalGross, net: totalNet, stableford: totalStableford },
            weather: weather || null,
            notes: notes || null,
        });

        return NextResponse.json(playedRound);
    } catch (error) {
        console.error('Error creating round:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verarbeite URL und Suchparameter
        const { searchParams } = new URL(request.url, process.env.NEXT_PUBLIC_URL || 'http://localhost:3000');
        const courseId = searchParams.get('courseId');

        const query = `*[_type == "playedRound" && user._ref == $userId ${
            courseId ? '&& course._ref == $courseId' : ''
        }] | order(date desc) {
            _id,
            date,
            playedTee,
            totals,
            course->{
                _id,
                name
            }
        }`;

        const rounds = await sanityClient.fetch(query, {
            userId: session.user._id,
            courseId,
        });

        return NextResponse.json(rounds);
    } catch (error) {
        console.error('Error fetching rounds:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
