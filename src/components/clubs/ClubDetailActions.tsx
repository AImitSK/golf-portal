// src/components/clubs/ClubDetailActions.tsx
'use client';

import React from 'react';
import GridNavi from "@/components/frontend-ui/GridNavi";

export const ClubDetailActions = () => {
    return (
        <div className="flex items-center gap-2">
            <button className="flex items-center justify-center h-9 w-9 rounded-full bg-dark-green text-white hover:bg-dark-green/90 transition-colors">
                <img src="/icons/iconShareWithe.svg" alt="Teilen" className="h-5 w-5"/>
            </button>
            <button className="flex items-center justify-center h-9 w-9 rounded-full bg-dark-green text-white hover:bg-dark-green/90 transition-colors">
                <img src="/icons/iconLoveWithe.svg" alt="Favorit" className="h-5 w-5"/>
            </button>
            <div className="relative flex items-center justify-center h-9 w-9">
                <GridNavi />
            </div>
        </div>
    );
};