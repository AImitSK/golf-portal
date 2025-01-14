import { GolfClub } from "@/types/club-types";

export const sortClubs = (clubs: GolfClub[]): GolfClub[] => {
    return clubs.sort((a, b) => {
        if (!a.aktuellesModell && b.aktuellesModell) return 1;
        if (a.aktuellesModell && !b.aktuellesModell) return -1;
        if (!a.aktuellesModell || !b.aktuellesModell) return 0;

        const aIsTop = !!a.aktuellesModell?.isTopPosition;
        const bIsTop = !!b.aktuellesModell?.isTopPosition;
        if (aIsTop && !bIsTop) return -1;
        if (!aIsTop && bIsTop) return 1;

        if (aIsTop && bIsTop) {
            return (a.aktuellesModell.topPositionRank || 0) - (b.aktuellesModell.topPositionRank || 0);
        }

        const aIsFree = a.aktuellesModell.name?.toLowerCase() === "free";
        const bIsFree = b.aktuellesModell.name?.toLowerCase() === "free";
        if (!aIsFree && bIsFree) return -1;
        if (aIsFree && !bIsFree) return 1;

        return 0;
    });
};