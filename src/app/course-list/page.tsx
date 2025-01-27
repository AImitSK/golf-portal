// src/app/course-list/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import sanityClient from "@/lib/sanityClient";
import NewRoundButton from "@/components/course-list/NewRoundButton";
import StatsDashboard from "@/components/course-list/StatsDashboard";
import FilteredRoundsList from "@/components/course-list/FilteredRoundsList";
import React from 'react';

export default async function CourseListPage(): Promise<React.JSX.Element> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/login');
    }

    const rounds = await sanityClient.fetch(`
    *[_type == "coursePlayed" && user._ref == $userId] {
        _id,
        club->{
            _id,
            title,
            slug
        },
        plays[]{
            _key,
            date,
            score,
            notiz,
            wetter
        }
    } | order(plays[0].date desc)
`, { userId: session.user._id });


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Meine gespielten Runden</h1>
                <NewRoundButton />
            </div>

            <StatsDashboard rounds={rounds} />

            <div className="mt-8">
                <FilteredRoundsList initialRounds={rounds} />
            </div>
        </div>
    );
}