// src/components/profile/ProfileForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Button from '@/components/frontend-ui/Button';
import { Input } from '@/components/catalyst-ui-kit/input';
import { Select } from '@/components/catalyst-ui-kit/select';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import { GolfClub } from '@/types/club-types';

interface FormData {
    name: string;
    email: string;
    heimatclub: string;
    image: string | File | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProfileForm() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Lade Profildaten
    const { data: profileData } = useSWR('/api/profile', fetcher);

    // Lade alle Golfclubs für die Heimatclub-Auswahl
    const { data: clubs } = useSWR<GolfClub[]>('/api/clubs', fetcher);

    // Initialisiere Formular mit Profildaten
    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                heimatclub: profileData.heimatclub?._id || '',
                image: profileData.image || null
            });
        }
    }, [profileData]);

    const [formData, setFormData] = useState<FormData>({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        heimatclub: '',
        image: session?.user?.image || null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    formDataToSend.append(key, value);
                }
            });

            const response = await fetch('/api/profile', {
                method: 'PATCH',
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Fehler beim Aktualisieren des Profils');
                return;
            }

            await update();
            setSuccess('Profil erfolgreich aktualisiert');

            // Automatisches Ausblenden der Erfolgsmeldung nach 3 Sekunden
            setTimeout(() => {
                setSuccess(null);
            }, 3000);

            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
        }
    };

    const renderProfileImage = () => {
        if (!formData.image) {
            return (
                <div className="size-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Kein Bild</span>
                </div>
            );
        }

        if (formData.image instanceof File) {
            return (
                <Image
                    src={URL.createObjectURL(formData.image)}
                    alt="Profilbild"
                    className="size-full object-cover"
                    width={80}
                    height={80}
                />
            );
        }

        return (
            <Image
                src={formData.image}
                alt="Profilbild"
                className="size-full object-cover"
                width={80}
                height={80}
            />
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            {/* Profilbild */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profilbild
                </label>
                <div className="flex items-center gap-4">
                    <div className="size-20 rounded-full overflow-hidden bg-gray-100">
                        {renderProfileImage()}
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                    />
                </div>
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                </label>
                <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail
                </label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                />
            </div>

            {/* Heimatclub */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heimatclub
                </label>
                <Select
                    value={formData.heimatclub}
                    onChange={(e) => setFormData(prev => ({ ...prev, heimatclub: e.target.value }))}
                >
                    <option value="">Bitte wählen...</option>
                    {clubs?.map((club) => (
                        <option key={club._id} value={club._id}>
                            {club.title}
                        </option>
                    ))}
                </Select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Wird gespeichert..." : "Speichern"}
                </Button>
            </div>
        </form>
    );
}