// src/components/course-list/CourseSelector.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { GolfCourse } from '@/types/golf-course';

interface CourseSelectorProps {
    courses: GolfCourse[];
}

export default function CourseSelector({ courses }: CourseSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.club.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Suche nach Platz oder Club..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 border rounded-md"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                    <button
                        key={course._id}
                        onClick={() => router.push(`/course-list/new-round?courseId=${course._id}`)}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    >
                        <h3 className="font-medium">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.club.name}</p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                            {course.tees.map((tee) => (
                                <div
                                    key={`${tee.color}-${tee.gender}`}
                                    className="inline-flex items-center gap-1"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: tee.color }}
                                    />
                                    <span className="text-xs">{tee.name}</span>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}