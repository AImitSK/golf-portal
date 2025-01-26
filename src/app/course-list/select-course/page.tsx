// src/app/course-list/select-course/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import sanityClient from "@/lib/sanityClient";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CourseSelector from "@/components/course-list/CourseSelector";

export default async function SelectCoursePage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/login');
    }

    const courses = await sanityClient.fetch(`
    *[_type == "golfCourse"] {
      _id,
      name,
      club-> {
        _id,
        name,
        "slug": slug.current
      },
      tees[] {
        name,
        color,
        gender
      }
    }
  `);

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Platz auswählen</CardTitle>
                </CardHeader>
                <CourseSelector courses={courses} />
            </Card>
        </div>
    );
}