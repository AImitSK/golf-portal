// src/app/course-list/new-round/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getGolfCourseById } from "@/lib/sanity/getGolfCourse";
import ScoreEntry from "@/components/course-list/ScoreEntry";
import { getUserById } from "@/lib/sanity/getUser";
import type { Tee } from "@/types/golf-course"; // Import für Tee

interface NewRoundPageProps {
    searchParams: {
        courseId: string;
    };
}

export default async function NewRoundPage({ searchParams }: NewRoundPageProps) {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/login');
    }

    const courseId = searchParams.courseId;
    if (!courseId) {
        redirect('/course-list');
    }

    const [course, user] = await Promise.all([
        getGolfCourseById(courseId),
        getUserById(session.user._id)
    ]);

    if (!course || !user) {
        redirect('/course-list');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Neue Runde eintragen</h1>
            <div className="mb-4">
                <h2 className="text-xl mb-2">{course.name}</h2>
                <p className="text-gray-600">Aktuelles HCP: {user.handicapIndex}</p>
            </div>

            <ScoreEntry
                course={course}
                playerHandicap={user.handicapIndex}
                onSubmitAction={async (data: {
                    tee: Tee;
                    scores: number[];
                    totalGross: number;
                    totalNet: number;
                    totalStableford: number;
                }) => {
                    'use server';

                    const response = await fetch('/api/rounds', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: session.user._id,
                            courseId: courseId,
                            ...data,
                            date: new Date().toISOString(),
                        }),
                    });

                    if (response.ok) {
                        redirect('/course-list');
                    }
                }}
            />
        </div>
    );
}
