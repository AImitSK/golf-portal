// src/components/auth/claim-club-form.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useDebounce } from "@/hooks/useDebounce";
import * as z from "zod";

// Schema für Club-Claiming
const ClaimClubSchema = z.object({
    admin: z.object({
        email: z.string().email("Gültige E-Mail-Adresse erforderlich"),
        password: z.string().min(8, "Mindestens 8 Zeichen"),
        name: z.string().min(2, "Name erforderlich"),
        position: z.string().min(2, "Position erforderlich"),
    }),
    claim: z.object({
        clubId: z.string().min(1, "Bitte wählen Sie einen Club aus"),
        verificationCode: z.string().optional(),
    })
});

type ClaimClubInput = z.infer<typeof ClaimClubSchema>;

interface GolfClub {
    _id: string;
    title: string;
    clubEmail: string;
    adresse: {
        ort: string;
    };
}

export const ClaimClubForm = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [clubs, setClubs] = useState<GolfClub[]>([]);
    const [selectedClub, setSelectedClub] = useState<GolfClub | null>(null);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState<"search" | "verify" | "admin">("search");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const form = useForm<ClaimClubInput>({
        resolver: zodResolver(ClaimClubSchema),
        defaultValues: {
            admin: {
                email: "",
                password: "",
                name: "",
                position: "",
            },
            claim: {
                clubId: "",
                verificationCode: "",
            }
        },
    });

    // Suche nach Clubs
    const searchClubs = async (term: string) => {
        if (term.length < 3) return;

        try {
            const response = await fetch(`/api/clubs/search?term=${encodeURIComponent(term)}`);
            const data = await response.json();
            setClubs(data.clubs);
        } catch (error) {
            console.error("Fehler bei der Club-Suche:", error);
            setError("Fehler bei der Club-Suche");
        }
    };

    // Wenn sich der Suchbegriff ändert
    React.useEffect(() => {
        if (debouncedSearch) {
            searchClubs(debouncedSearch);
        } else {
            setClubs([]);
        }
    }, [debouncedSearch]);

    const onSubmit = async (data: ClaimClubInput) => {
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/claim-club", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                setError(responseData.error || "Ein Fehler ist aufgetreten");
                return;
            }

            setSuccess("Club wird übernommen...");

            // Kurz warten, damit User die Erfolgsmeldung sieht
            setTimeout(() => {
                window.location.href = "/club-backend";
            }, 2000);
        } catch (error) {
            setError("Verbindungsfehler beim Absenden der Anfrage");
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Golf Club Logo"
                    src="/logo-c-list-green.svg"
                    className="mx-auto h-16 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Club übernehmen
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Schritt {step === "search" ? "1/3" : step === "verify" ? "2/3" : "3/3"}
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Club-Suche */}
                    {step === "search" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Club suchen
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mt-2 block w-full rounded-md border px-3 py-1.5"
                                    placeholder="Clubname eingeben..."
                                />
                            </div>

                            {/* Club-Liste */}
                            {clubs.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {clubs.map((club) => (
                                        <button
                                            key={club._id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedClub(club);
                                                form.setValue("claim.clubId", club._id);
                                                setStep("verify");
                                            }}
                                            className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
                                        >
                                            <div className="font-medium">{club.title}</div>
                                            <div className="text-sm text-gray-500">{club.adresse.ort}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Email-Verifikation */}
                    {step === "verify" && selectedClub && (
                        <div className="space-y-4">
                            <div className="p-4 border rounded-md bg-gray-50">
                                <h3 className="font-medium">{selectedClub.title}</h3>
                                <p className="text-sm text-gray-500">{selectedClub.adresse.ort}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Club E-Mail-Adresse
                                </label>
                                <input
                                    {...form.register("admin.email")}
                                    type="email"
                                    className="mt-2 block w-full rounded-md border px-3 py-1.5"
                                    placeholder={selectedClub.clubEmail}
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Bitte verwenden Sie eine E-Mail-Adresse der Club-Domain
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep("admin")}
                                className="w-full rounded-md bg-[#006633] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#2CDB48]"
                            >
                                Weiter
                            </button>
                        </div>
                    )}

                    {/* Admin-Informationen */}
                    {step === "admin" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Name
                                </label>
                                <input
                                    {...form.register("admin.name")}
                                    className="mt-2 block w-full rounded-md border px-3 py-1.5"
                                    placeholder="Vollständiger Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Position
                                </label>
                                <input
                                    {...form.register("admin.position")}
                                    className="mt-2 block w-full rounded-md border px-3 py-1.5"
                                    placeholder="z.B. Clubmanager"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Passwort
                                </label>
                                <input
                                    {...form.register("admin.password")}
                                    type="password"
                                    className="mt-2 block w-full rounded-md border px-3 py-1.5"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded-md bg-[#006633] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#2CDB48] disabled:opacity-50"
                            >
                                {isPending ? "Wird geprüft..." : "Club übernehmen"}
                            </button>
                        </div>
                    )}

                    {error && <FormError message={error} />}
                    {success && <FormSuccess message={success} />}

                    {/* Navigation */}
                    {step !== "search" && (
                        <button
                            type="button"
                            onClick={() => setStep(step === "admin" ? "verify" : "search")}
                            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
                        >
                            Zurück
                        </button>
                    )}
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Noch keinen Club gefunden?{" "}
                    <a
                        href="/auth/register-club"
                        className="font-semibold text-[#006633] hover:text-[#2CDB48]"
                    >
                        Neuen Club registrieren
                    </a>
                </p>
            </div>
        </div>
    );
};