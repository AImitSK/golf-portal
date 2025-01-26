// src/lib/sanity/getGolfCourse.ts
import sanityClient from '@/lib/sanityClient'
import type { GolfCourse } from '@/types/golf-course';

export async function getGolfCourseById(courseId: string): Promise<GolfCourse | null> {
    return sanityClient.fetch(`
    *[_type == "golfCourse" && _id == $courseId][0] {
      _id,
      _type,
      name,
      club->{
        _id,
        name,
        "slug": slug.current
      },
      tees[] {
        name,
        color,
        gender,
        courseRating,
        slopeRating,
        par,
        holes[] {
          number,
          par,
          length,
          handicapIndex,
          courseHCP
        }
      }
    }
  `, { courseId });
}