// src/app/course-list/rounds/[roundId]/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import sanityClient from "@/lib/sanityClient";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import RoundDetail from "@/components/course-list/RoundDetail";

interface RoundDetailPageProps {
    params: {
        roundId: string;
    };
}

export default async function RoundDetailPage({ params }: RoundDetailPageProps) {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/login');
    }

    const round = await sanityClient.fetch(`
    *[_type == "playedRound" && _id == $roundId && user._ref == $userId][0] {
      _id,
      date,
      playedTee,
      playerHandicap,
      courseHandicap,
      holeScores,
      totals,
      weather,
      notes,
      course->{
        _id,
        name
      }
    }
  `, {
        roundId: params.roundId,
        userId: session.user._id
    });

    if (!round) {
        redirect('/course-list');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl">{round.course.name}</h1>
                            <p className="text-gray-500 text-sm">{formatDate(round.date)}</p>
                        </div>
                        <div className="text-right">
                            <p>HCP: {round.playerHandicap}</p>
                            <p className="text-sm text-gray-500">Course HCP: {round.courseHandicap}</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <RoundDetail round={round} />
            </Card>
        </div>
    );
}