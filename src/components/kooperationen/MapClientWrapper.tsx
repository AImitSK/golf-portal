// src/components/kooperationen/MapClientWrapper.tsx
'use client';

import dynamic from "next/dynamic";

const KoopMap = dynamic(() => import("./KoopMap"), {
    ssr: false
});

interface MapClientWrapperProps {
    clubs: any[];
    kooperationName: string;
}

export default function MapClientWrapper({ clubs, kooperationName }: MapClientWrapperProps) {
    return <KoopMap clubs={clubs} kooperationName={kooperationName} />;
}