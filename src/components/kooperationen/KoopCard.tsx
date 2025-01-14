// src/components/kooperationen/KoopCard.tsx
import React from "react";
import { Kooperation } from "@/types/club-types";
import Link from "next/link";

type KoopCardProps = {
    kooperation: Kooperation;
};

export const KoopCard: React.FC<KoopCardProps> = ({ kooperation }) => {
    return (
        <Link
            href={`/kooperationen/${kooperation.slug}`}
            className="block group"
        >
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {/* Logo Container */}
                <div className="h-48 relative bg-gray-50 border-b">
                    {kooperation.logo && (
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <img
                                src={kooperation.logo}
                                alt={`${kooperation.name} Logo`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-2">
                        {kooperation.name}
                    </h2>

                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {kooperation.typ}
                        </span>
                    </div>

                    <p className="text-gray-600 line-clamp-3">
                        {kooperation.beschreibung}
                    </p>
                </div>
            </div>
        </Link>
    );
};