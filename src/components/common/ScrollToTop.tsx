// src/components/common/ScrollToTop.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-cta-green text-white shadow-lg hover:bg-dark-green transition-colors duration-200"
            aria-label="Zurück nach oben"
        >
            <ChevronUp className="w-6 h-6" />
        </button>
    );
};