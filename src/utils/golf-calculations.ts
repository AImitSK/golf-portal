// src/utils/golf-calculations.ts

interface CourseHandicapParams {
    handicapIndex: number;
    slopeRating: number;
    courseRating: number;
    par: number;
}

/**
 * Berechnet das Course Handicap basierend auf dem Handicap Index
 * Formula: (HCP-Index × (SR ÷ 113)) + (CR - Par)
 */
export function calculateCourseHandicap({
                                            handicapIndex,
                                            slopeRating,
                                            courseRating,
                                            par
                                        }: CourseHandicapParams): number {
    const courseHandicap = (handicapIndex * (slopeRating / 113)) + (courseRating - par);
    return Math.round(courseHandicap);
}

/**
 * Berechnet das Playing Handicap (für Wettkämpfe)
 * Standard-Vorgabe ist 95% für Einzelspiele
 */
export function calculatePlayingHandicap(
    courseHandicap: number,
    handicapAllowance: number = 95
): number {
    return Math.round(courseHandicap * (handicapAllowance / 100));
}

/**
 * Berechnet den Netto-Score für ein einzelnes Loch
 * Berücksichtigt Course Handicap und Loch-Index
 */
export function calculateNetScore(
    grossScore: number,
    courseHandicap: number,
    holeHandicap: number
): number {
    if (!grossScore) return 0;

    // Berechne die Basis-Extragschläge pro Loch
    const extraStrokes = Math.floor(courseHandicap / 18);

    // Zusätzlicher Schlag wenn der Loch-Index kleiner/gleich dem Rest ist
    const additionalStroke = holeHandicap <= (courseHandicap % 18) ? 1 : 0;

    return grossScore - (extraStrokes + additionalStroke);
}

/**
 * Berechnet Stableford-Punkte basierend auf Netto-Score und Par
 */
export function calculateStablefordPoints(
    netScore: number,
    par: number
): number {
    if (!netScore || !par) return 0;

    const scoreRelativeToPar = netScore - par;

    // Stableford Punkte-Tabelle
    const pointsTable: Record<number, number> = {
        [-4]: 6, // 4 unter Par (Kondor)
        [-3]: 5, // 3 unter Par (Albatros)
        [-2]: 4, // 2 unter Par (Eagle)
        [-1]: 3, // 1 unter Par (Birdie)
        [0]: 2,  // Par
        [1]: 1,  // 1 über Par (Bogey)
        [2]: 0   // 2 oder mehr über Par
    };

    return pointsTable[Math.min(Math.max(scoreRelativeToPar, -4), 2)] || 0;
}

/**
 * Berechnet die Gesamtstatistik für eine Runde
 */
interface RoundStats {
    totalGross: number;
    totalNet: number;
    totalStableford: number;
    birdiesOrBetter: number;
    pars: number;
    bogeys: number;
    doubleBogeyOrWorse: number;
}

export function calculateRoundStats(
    scores: number[],
    pars: number[],
    courseHandicap: number,
    holeHandicaps: number[]
): RoundStats {
    const stats: RoundStats = {
        totalGross: 0,
        totalNet: 0,
        totalStableford: 0,
        birdiesOrBetter: 0,
        pars: 0,
        bogeys: 0,
        doubleBogeyOrWorse: 0
    };

    scores.forEach((score, index) => {
        // Grundlegende Summen
        stats.totalGross += score;

        const netScore = calculateNetScore(score, courseHandicap, holeHandicaps[index]);
        stats.totalNet += netScore;
        stats.totalStableford += calculateStablefordPoints(netScore, pars[index]);

        // Statistiken
        const scoreToPar = score - pars[index];
        if (scoreToPar <= -1) stats.birdiesOrBetter++;
        else if (scoreToPar === 0) stats.pars++;
        else if (scoreToPar === 1) stats.bogeys++;
        else if (scoreToPar >= 2) stats.doubleBogeyOrWorse++;
    });

    return stats;
}

/**
 * Überprüft, ob ein Score gültig ist
 */
export function isValidScore(score: number): boolean {
    return score > 0 && score <= 15; // Maximal 15 Schläge pro Loch
}