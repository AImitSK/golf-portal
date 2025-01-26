// src/types/golf-course.d.ts

export type TeeColor = 'white' | 'yellow' | 'blue' | 'red';
export type Gender = 'Herren' | 'Damen';

export interface GolfHole {
    number: number;
    par: number;
    length: number;
    handicapIndex: number;
    courseHCP: number;
}

export interface Tee {
    name: string;
    color: TeeColor;
    gender: Gender;
    courseRating: number;
    slopeRating: number;
    par: number;
    holes: GolfHole[];
}

export interface Club {
    _id: string;
    name: string;
    slug: string;
}

export interface GolfCourse {
    _id: string;
    _type: 'golfCourse';
    name: string;
    club: Club;
    tees: Tee[];
}