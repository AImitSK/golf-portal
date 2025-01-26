// src/types/played-round.d.ts
export interface HoleScore {
    number: number;
    par: number;
    score: number;
    netScore: number;
    stableford: number;
}

export interface RoundTotals {
    gross: number;
    net: number;
    stableford: number;
}

export interface PlayedTee {
    name: string;
    color: string;
    courseRating: number;
    slopeRating: number;
    par: number;
}

export interface PlayedRound {
    _id: string;
    _type: 'playedRound';
    user: {
        _ref: string;
        _type: 'reference';
    };
    course: {
        _ref: string;
        _type: 'reference';
    };
    playedTee: PlayedTee;
    playerHandicap: number;
    courseHandicap: number;
    date: string;
    holeScores: HoleScore[];
    totals: RoundTotals;
    weather?: 'Sonnig' | 'Bewölkt' | 'Regnerisch' | 'Windig';
    notes?: string;
}

export type PlayedRoundDocument = PlayedRound & {
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
}