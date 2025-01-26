// src/components/course-list/NewRoundButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';

interface NewRoundButtonProps {
    className?: string;
}

export default function NewRoundButton({ className }: NewRoundButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/course-list/select-course')}
            className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${className}`}
        >
            <PlusIcon className="h-5 w-5" />
            Neue Runde
        </button>
    );
}