// src/types/round.ts
export interface RoundPlay {
    _key: string;
    date: string;
    score: number;
    notiz?: string;
    wetter?: string;
}

export interface Round {
    _id: string;
    _type: 'coursePlayed';
    user: {
        _ref: string;
        _type: 'reference';
    };
    club: {
        _id: string;
        name: string;
    };
    plays: RoundPlay[];
    createdAt?: string;
}