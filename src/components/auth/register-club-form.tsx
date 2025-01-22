"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

// Erweitertes Schema für Club-Registrierung
const ClubRegisterSchema = z.object({
  // Admin Details
  admin: z.object({
    email: z.string().email("Gültige E-Mail-Adresse erforderlich"),
    password: z.string().min(8, "Mindestens 8 Zeichen"),
    name: z.string().min(2, "Name erforderlich"),
    position: z.string().min(2, "Position erforderlich"),
  }),

  // Club Details
  club: z.object({
    name: z.string().min(2, "Clubname erforderlich"),
    website: z.string().url("Gültige URL erforderlich").optional(),
    telefon: z.string().optional(),
    email: z.string().email("Gültige Club E-Mail erforderlich"),
  }),

  // Adresse
  adresse: z.object({
    strasse: z.string().min(1, "Straße erforderlich"),
    hausnummer: z.string().min(1, "Hausnummer erforderlich"),
    plz: z.string().regex(/^\d{5}$/, "Gültige PLZ erforderlich"),
    ort: z.string().min(1, "Ort erforderlich"),
  }),
});

type ClubRegisterInput = z.infer<typeof ClubRegisterSchema>;

export function RegisterForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"admin" | "club" | "address">("admin");

  const form = useForm<ClubRegisterInput>({
    resolver: zodResolver(ClubRegisterSchema),
    defaultValues: {
      admin: {
        email: "",
        password: "",
        name: "",
        position: "",
      },
      club: {
        name: "",
        website: "",
        telefon: "",
        email: "",
      },
      adresse: {
        strasse: "",
        hausnummer: "",
        plz: "",
        ort: "",
      },
    },
  });

  const onSubmit = async (data: ClubRegisterInput) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      fetch("/api/auth/register-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
          .then(async (res) => {
            if (!res.ok) {
              const error = await res.json();
              throw new Error(error.message);
            }
            return res.json();
          })
          .then(() => {
            setSuccess("Club erfolgreich registriert!");
            // Optionale Weiterleitung zum Club-Backend
            window.location.href = "/club-backend";
          })
          .catch((error) => {
            setError(error.message);
          });
    });
  };

  const nextStep = () => {
    if (step === "admin") setStep("club");
    else if (step === "club") setStep("address");
  };

  const prevStep = () => {
    if (step === "address") setStep("club");
    else if (step === "club") setStep("admin");
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
            Als Golfclub registrieren
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Schritt {step === "admin" ? "1/3" : step === "club" ? "2/3" : "3/3"}
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Administrator Form */}
            {step === "admin" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Administrator-Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Name
                    </label>
                    <input
                        {...form.register("admin.name")}
                        className="mt-2 block w-full rounded-md border px-3 py-1.5"
                        placeholder="Vollständiger Name"
                    />
                    {form.formState.errors.admin?.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.formState.errors.admin.name.message}
                        </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      E-Mail
                    </label>
                    <input
                        {...form.register("admin.email")}
                        type="email"
                        className="mt-2 block w-full rounded-md border px-3 py-1.5"
                        placeholder="ihre@email.de"
                    />
                    {form.formState.errors.admin?.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.formState.errors.admin.email.message}
                        </p>
                    )}
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
                </div>
            )}

            {/* Club Form */}
            {step === "club" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Club-Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Clubname
                    </label>
                    <input
                        {...form.register("club.name")}
                        className="mt-2 block w-full rounded-md border px-3 py-1.5"
                        placeholder="Name des Golfclubs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Club E-Mail
                    </label>
                    <input
                        {...form.register("club.email")}
                        type="email"
                        className="mt-2 block w-full rounded-md border px-3 py-1.5"
                        placeholder="club@golfclub.de"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Website
                    </label>
                    <input
                        {...form.register("club.website")}
                        type="url"
                        className="mt-2 block w-full rounded-md border px-3 py-1.5"
                        placeholder="https://www.golfclub.de"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Telefon
                    </label>
                    <input
                        {...form.register("club.telefon")}
                        className="mt-2 block w-full rounded-md border px-3 py-1.5"
                        placeholder="+49 123 456789"
                    />
                  </div>
                </div>
            )}

            {/* Adresse Form */}
            {step === "address" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Adresse</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Straße
                      </label>
                      <input
                          {...form.register("adresse.strasse")}
                          className="mt-2 block w-full rounded-md border px-3 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Hausnummer
                      </label>
                      <input
                          {...form.register("adresse.hausnummer")}
                          className="mt-2 block w-full rounded-md border px-3 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        PLZ
                      </label>
                      <input
                          {...form.register("adresse.plz")}
                          className="mt-2 block w-full rounded-md border px-3 py-1.5"
                          maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Ort
                      </label>
                      <input
                          {...form.register("adresse.ort")}
                          className="mt-2 block w-full rounded-md border px-3 py-1.5"
                      />
                    </div>
                  </div>
                </div>
            )}

            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}

            <div className="flex justify-between gap-4">
              {step !== "admin" && (
                  <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                  >
                    Zurück
                  </button>
              )}

              {step !== "address" ? (
                  <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 rounded-md bg-[#006633] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#2CDB48]"
                  >
                    Weiter
                  </button>
              ) : (
                  <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 rounded-md bg-[#006633] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#2CDB48] disabled:opacity-50"
                  >
                    {isPending ? "Wird registriert..." : "Club registrieren"}
                  </button>
              )}
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Bereits registriert?{" "}
            <a
                href="/auth/login"
                className="font-semibold text-[#006633] hover:text-[#2CDB48]"
            >
              Zum Login
            </a>
          </p>
        </div>
      </div>
  );
}