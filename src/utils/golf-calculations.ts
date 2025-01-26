// src/utils/golf-calculations.ts

interface CourseHandicapParams {
    handicapIndex: number;
    slopeRating: number;
    courseRating: number;
    par: number;
}

export function calculateCourseHandicap({
                                            handicapIndex,
                                            slopeRating,
                                            courseRating,
                                            par
                                        }: CourseHandicapParams): number {
    // Formel: (HCP-Index × (SR ÷ 113)) + (CR - Par)
    return Math.round(
        (handicapIndex * (slopeRating / 113)) + (courseRating - par)
    );
}

export function calculatePlayingHandicap(courseHandicap: number, handicapAllowance: number = 95): number {
    // Standard-Vorgabe ist 95% für Einzelspiele
    return Math.round(courseHandicap * (handicapAllowance / 100));
}

export function calculateNetScore(grossScore: number, courseHandicap: number, holeHandicap: number): number {
    // Berechnung der Netto-Schläge pro Loch
    const extraStrokes = Math.floor(courseHandicap / 18);
    const additionalStroke = holeHandicap <= (courseHandicap % 18) ? 1 : 0;
    return grossScore - (extraStrokes + additionalStroke);
}

export function calculateStablefordPoints(netScore: number, par: number): number {
    const pointsTable: Record<number, number> = {
        2: 0,  // Double Bogey oder schlechter
        1: 1,  // Bogey
        0: 2,  // Par
        [-1]: 3,  // Birdie
        [-2]: 4,  // Eagle
        [-3]: 5   // Albatross
    };

    const scoreRelativeToPar = netScore - par;
    return pointsTable[Math.min(Math.max(scoreRelativeToPar, -3), 2)] || 0;
}