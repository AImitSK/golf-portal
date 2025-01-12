import React from "react";
import { KoopCard } from "./KoopCard";
import { Kooperation } from "@/types/club-types";

type KoopGridProps = {
    kooperationen: Kooperation[];
};

const KoopGrid: React.FC<KoopGridProps> = ({ kooperationen }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kooperationen.map((koop) => (
                // Verwende slug.current sicher als string
                <KoopCard key={koop.slug.current} kooperation={koop} />
            ))}
        </div>
    );
};

export default KoopGrid;