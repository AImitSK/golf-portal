// src/app/api/course-list/add-round/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/sanity/getUser';
import sanityClient from '@/lib/sanityClient';
import {
    type ScoreInputData,
    type HoleScore,
    type PlayedTee
} from '@/types/golf-round';
import { calculateNetScore, calculateStablefordPoints } from '@/utils/golf-calculations';

async function validateInputData(data: ScoreInputData): Promise<string | null> {
    if (!data.tee || !data.scores) {
        return 'Fehlende Tee oder Score Daten';
    }
    if (!data.date) {
        return 'Kein Datum angegeben';
    }
    // Prüfe auf fehlende Scores
    if (data.scores.some(score => !score)) {
        return 'Bitte geben Sie Scores für alle Löcher ein';
    }
    return null;
}

function calculateHoleScores(
    scores: number[],
    tee: PlayedTee,
    playerHandicap: number
): HoleScore[] {
    return tee.holes.map((hole, index) => {
        const score = scores[index];
        const netScore = calculateNetScore(
            score,
            playerHandicap,
            hole.handicapIndex
        );

        return {
            _key: `score-${index + 1}`, // Unique key für jeden Score
            number: hole.number,
            par: hole.par,
            score: score,
            netScore: netScore,
            stableford: calculateStablefordPoints(netScore, hole.par),
            extraStroke: (playerHandicap % 18) >= hole.handicapIndex
        };
    });
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
        const validationError = await validateInputData(data);
        if (validationError) {
            return NextResponse.json(
                { message: validationError },
                { status: 400 }
            );
        }

        const calculatedHoleScores = calculateHoleScores(
            data.scores,
            data.tee,
            data.playerHandicap
        );

        const golfRound = {
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
            playedTee: {
                name: data.tee.name,
                color: data.tee.color,
                gender: data.tee.gender,
                courseRating: data.tee.courseRating,
                slopeRating: data.tee.slopeRating,
                par: data.tee.par,
                holes: data.tee.holes.map((hole, index) => ({
                    _key: `hole-${index + 1}`,
                    number: hole.number,
                    par: hole.par,
                    handicapIndex: hole.handicapIndex,
                    length: hole.length,
                    courseHCP: hole.courseHCP
                }))
            },
            playerHandicap: data.playerHandicap,
            courseHandicap: data.playerHandicap,
            holeScores: calculatedHoleScores,
            totals: {
                gross: data.totalGross,
                net: data.totalNet,
                stableford: data.totalStableford
            },
            weather: data.weather,
            notes: data.notes
        };

        // Debug-Log
        console.log('Saving golf round:', JSON.stringify(golfRound, null, 2));

        const savedRound = await sanityClient.create(golfRound);

        // Debug-Log
        console.log('Saved round response:', savedRound);

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