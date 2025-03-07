// src/app/api/course-list/add-round/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/sanity/getUser';
import sanityClient from '@/lib/sanityClient';
import {
    type GolfHole,
    type TeeColor,
} from '@/types/golf-course';

interface SanityReference {
    _ref: string;
    _type: 'reference';
}

interface ScoreInputData {
    courseId: string;
    playerHandicap: number;
    date: string;
    tee: {
        name: string;
        color: TeeColor;
        gender: string;
        courseRating: number;
        slopeRating: number;
        par: number;
        holes: GolfHole[];
    };
    scores: number[];
    totalGross: number;
    totalNet: number;
    totalStableford: number;
    weather?: 'sunny' | 'cloudy' | 'rainy' | 'windy';
    notes?: string;
}

interface GolfRoundDocument {
    _type: 'golfRound';
    user: SanityReference;
    course: SanityReference;
    date: string;
    playerHandicap: number;
    playedTee: {
        name: string;
        color: TeeColor;
        gender: string;
        courseRating: number;
        slopeRating: number;
        par: number;
        holes: Array<{
            number: number;
            par: number;
            handicapIndex: number;
            length: number;
            courseHCP: number;
        }>;
    };
    holeScores: Array<{
        number: number;
        par: number;
        score: number;
        netScore: number;
        stableford: number;
        extraStroke: boolean;
    }>;
    totals: {
        gross: number;
        net: number;
        stableford: number;
    };
    weather?: 'sunny' | 'cloudy' | 'rainy' | 'windy';
    notes?: string;
}

async function validateData(data: ScoreInputData): Promise<string | null> {
    if (!data.playerHandicap && data.playerHandicap !== 0) {
        return 'Spieler Handicap fehlt';
    }
    if (!data.tee?.holes || data.tee.holes.length !== 18) {
        return 'Ungültige Löcher-Daten';
    }
    if (!data.scores || data.scores.length !== 18) {
        return 'Ungültige Score-Daten';
    }
    return null;
}

export async function POST(request: NextRequest) {
    try {
        const userIdFromHeader = request.headers.get('X-User-ID');
        if (!userIdFromHeader) {
            return NextResponse.json(
                { message: 'Nicht autorisiert' },
                { status: 401 }
            );
        }

        const user = await getUserById(userIdFromHeader);
        if (!user) {
            return NextResponse.json(
                { message: 'Benutzer nicht gefunden' },
                { status: 401 }
            );
        }

        const data: ScoreInputData = await request.json();
        console.log('Received data:', data);

        const validationError = await validateData(data);
        if (validationError) {
            return NextResponse.json(
                { message: validationError },
                { status: 400 }
            );
        }

        // Create new golf round document
        const golfRound: GolfRoundDocument = {
            _type: 'golfRound',
            user: {
                _ref: userIdFromHeader,
                _type: 'reference'
            },
            course: {
                _ref: data.courseId,
                _type: 'reference'
            },
            date: data.date,
            playerHandicap: data.playerHandicap,
            playedTee: {
                name: data.tee.name,
                color: data.tee.color,
                gender: data.tee.gender,
                courseRating: data.tee.courseRating,
                slopeRating: data.tee.slopeRating,
                par: data.tee.par,
                holes: data.tee.holes.map((hole: GolfHole, index: number) => ({
                    number: index + 1,
                    par: hole.par,
                    handicapIndex: hole.handicapIndex,
                    length: hole.length || 0,
                    courseHCP: hole.courseHCP || 0
                }))
            },
            holeScores: data.tee.holes.map((hole: GolfHole, index: number) => ({
                number: index + 1,
                par: hole.par,
                score: data.scores[index] || 0,
                netScore: data.scores[index] || 0,
                stableford: 0,
                extraStroke: false
            })),
            totals: {
                gross: data.totalGross,
                net: data.totalNet,
                stableford: data.totalStableford
            },
            weather: data.weather,
            notes: data.notes
        };

        console.log('Saving round:', golfRound);
        const savedRound = await sanityClient.create(golfRound);
        console.log('Saved round:', savedRound);

        return NextResponse.json({
            message: 'Runde erfolgreich gespeichert',
            roundId: savedRound._id
        }, { status: 200 });

    } catch (error) {
        console.error('Error saving round:', error);
        return NextResponse.json({
            message: 'Fehler beim Speichern der Runde',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}