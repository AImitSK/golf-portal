// src/app/course-list/new-round/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getGolfCourseById } from "@/lib/sanity/getGolfCourse";
import ScoreEntry from "@/components/course-list/ScoreEntry";
import { getUserById } from "@/lib/sanity/getUser";

interface NewRoundPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function NewRoundPage({ searchParams }: NewRoundPageProps) {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/login');
    }

    const courseId = typeof searchParams.courseId === 'string' ? searchParams.courseId : undefined;
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
                userId={session.user._id}
            />
        </div>
    );
}