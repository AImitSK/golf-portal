import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import sanityClient from "@/lib/sanityClient";
import { getKooperationBySlug } from "@/lib/sanity/getKooperation";

type KooperationDetailProps = {
    kooperation: {
        name: string;
        beschreibung: string;
        logo?: {
            asset: {
                _ref: string;
                _type: string;
            };
        };
        typ: string;
        slug: string;
    } | null;
};

const KooperationDetail: React.FC<KooperationDetailProps> = ({ kooperation }) => {
    if (!kooperation) {
        return <h1>Kooperation nicht gefunden</h1>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold">{kooperation.name}</h1>
            <p className="mt-4 text-lg">{kooperation.beschreibung}</p>
            <p className="mt-4 text-gray-600">Typ: {kooperation.typ}</p>
            {kooperation.logo && (
                <img
                    src={`https://cdn.sanity.io/images/your-project-id/your-dataset/${kooperation.logo.asset._ref.replace(
                        "image-",
                        ""
                    )}.jpg`}
                    alt={kooperation.name}
                    className="mt-4"
                />
            )}
        </div>
    );
};

export default KooperationDetail;