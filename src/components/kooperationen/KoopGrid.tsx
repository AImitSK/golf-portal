// src/components/kooperationen/KoopGrid.tsx
import React from "react";
import { KoopCard } from "./KoopCard";
import { Kooperation } from "@/types/club-types";

type KoopGridProps = {
    kooperationen: Kooperation[];
};

const KoopGrid: React.FC<KoopGridProps> = ({ kooperationen }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {kooperationen.map((koop) => (
                <KoopCard key={koop.slug} kooperation={koop} />
            ))}
        </div>
    );
};

export default KoopGrid;