import React from 'react';

export const Avatar = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-full w-12 h-12 overflow-hidden">{children}</div>
);

export const AvatarImage = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className="w-full h-full object-cover" />
);

export const AvatarFallback = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-full flex items-center justify-center bg-gray-200 text-gray-700 ${className}`}>
        {children}
    </div>
);



