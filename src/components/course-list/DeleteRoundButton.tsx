'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteRoundButtonProps {
    roundId: string;
    playKey: string;
    onDelete?: () => void;
}

export default function DeleteRoundButton({
                                              roundId,
                                              playKey,
                                              onDelete
                                          }: DeleteRoundButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Möchten Sie diese Runde wirklich löschen?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/course-list/${roundId}/plays/${playKey}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onDelete?.(); // Rufe die Lösch-Callback-Funktion auf
                router.refresh(); // Zusätzlicher Refresh für Server-Komponenten
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Error deleting round:', error);
            alert('Fehler beim Löschen der Runde');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`text-red-600 hover:text-red-800 disabled:opacity-50 ${
                isDeleting ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
        >
            {isDeleting ? 'Wird gelöscht...' : 'Löschen'}
        </button>
    );
}