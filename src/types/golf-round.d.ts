// src/types/golf-round.d.ts
import type { GolfCourse, Tee, GolfHole } from './golf-course';
export { GolfCourse };

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'windy';
export type TeeColor = 'white' | 'yellow' | 'blue' | 'red';

export interface PlayedTee extends Omit<Tee, 'holes'> {
    holes: GolfHole[];
}

export interface GolfHole {
    number: number;
    par: number;
    handicapIndex: number;
    length?: number;
}

export interface PlayedTee {
    name: string;
    color: TeeColor;
    courseRating: number;
    slopeRating: number;
    par: number;
    holes: GolfHole[];
}

export interface HoleScore {
    number: number;
    par: number;
    score: number;
    netScore: number;
    stableford: number;
    extraStroke?: boolean;
}

export interface RoundTotals {
    gross: number;
    net: number;
    stableford: number;
}

export interface GolfRound {
    _id?: string;
    _type: 'golfRound';
    user: {
        _ref: string;
        _type: 'reference';
    };
    course: {
        _ref: string;
        _type: 'reference';
    };
    date: string;
    playedTee: PlayedTee;
    playerHandicap: number;
    courseHandicap: number;
    holeScores: HoleScore[];
    totals: RoundTotals;
    weather?: WeatherType;
    notes?: string;
}

// Alias zur Vereinfachung des Imports
export type Round = GolfRound;

// Für die API-Requests
export interface GolfRoundInput {
    courseId: string;
    date: string;
    tee: PlayedTee;
    scores: number[];
    playerHandicap: number;
    weather?: WeatherType;
    notes?: string;
}

// Für die UI-Komponenten
export interface ScoreInputData {
    courseId: string;
    tee: PlayedTee;
    scores: number[];
    totalGross: number;
    totalNet: number;
    totalStableford: number;
    playerHandicap: number;
    date: string;
    weather?: WeatherType;
    notes?: string;
}

// StatsDashboard Props
export interface StatsDashboardProps {
    scores: number[];
    tee: PlayedTee;
    courseHandicap: number;
}