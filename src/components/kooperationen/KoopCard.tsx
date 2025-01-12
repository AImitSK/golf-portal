import React from "react";
import { Kooperation } from "@/types/club-types";
import { Heading } from "@/components/frontend-ui/Heading";
import Link from "next/link"; // Next.js Link

type KoopCardProps = {
    kooperation: Kooperation;
};

export const KoopCard: React.FC<KoopCardProps> = ({ kooperation }) => {
    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <Link href={`/kooperation/${kooperation.slug}`}>
                {/* Link zur Detailseite */}
                <Heading
                    level={2}
                    variant="default"
                    className="text-dark-green font-semibold hover:text-cta-green transition-colors"
                >
                    {kooperation.name}
                </Heading>
            </Link>
            <p>{kooperation.beschreibung}</p>
        </div>
    );
};