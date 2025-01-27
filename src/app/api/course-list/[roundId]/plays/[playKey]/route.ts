// src/app/api/course-list/[roundId]/plays/[playKey]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import sanityClient from '@/lib/sanityClient';

// src/app/api/course-list/[roundId]/plays/[playKey]/route.ts
export async function DELETE(
    request: NextRequest,
    { params }: { params: { roundId: string, playKey: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: 'Nicht autorisiert' }, { status: 401 });
        }

        const { roundId, playKey } = params;

        // Ersten Schritt: Überprüfen, ob der Eintrag dem Benutzer gehört
        const existingRound = await sanityClient.fetch(
            `*[_type == "coursePlayed" && _id == $roundId && user._ref == $userId][0]`,
            { roundId, userId: session.user._id }
        );

        if (!existingRound) {
            return NextResponse.json({ message: 'Runde nicht gefunden' }, { status: 404 });
        }

        // Hole die aktuellen Plays vor dem Löschen
        console.log('Existing plays before deletion:', existingRound.plays);

        // Entferne den spezifischen Play-Eintrag
        const updatedRound = await sanityClient
            .patch(roundId)
            .unset([`plays[_key=="${playKey}"]`])
            .commit({ autoGenerateArrayKeys: true });

        console.log('Updated round after deletion:', updatedRound);

        // Prüfe die verbleibenden Plays
        const finalRound = await sanityClient.fetch(
            `*[_type == "coursePlayed" && _id == $roundId][0]`,
            { roundId }
        );

        console.log('Final round plays:', finalRound.plays);

        // Lösche den gesamten Eintrag, wenn keine Plays mehr vorhanden
        if (!finalRound.plays || finalRound.plays.length === 0) {
            await sanityClient.delete(roundId);
            console.log('Entire round deleted due to no plays');
        }

        return NextResponse.json({
            message: 'Runde erfolgreich gelöscht',
            remainingPlays: finalRound.plays
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting round:', error);
        return NextResponse.json({
            message: 'Fehler beim Löschen der Runde',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}