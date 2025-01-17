"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/schemas/auth-schemas";
import { login } from "@/actions/login";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(async () => {
      try {
        const result = await login(values);
        
        if (result?.error) {
          setError(result.error);
        }
        if (result?.success) {
          setSuccess(result.success);
        }
      } catch (err) {
        setError("Ein Fehler ist aufgetreten");
      }
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="/logo-c-list-green.svg"
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Willkommen zurück
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-Mail-Adresse
            </label>
            <div className="mt-2">
              <input
                {...form.register("email")}
                type="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#006633]"
              />
              {form.formState.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Passwort
              </label>
              <a href="/auth/reset" className="text-sm font-semibold text-[#006633] hover:text-[#2CDB48]">
                Passwort vergessen?
              </a>
            </div>
            <div className="mt-2">
              <input
                {...form.register("password")}
                type="password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#006633]"
              />
              {form.formState.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full justify-center rounded-md bg-[#006633] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2CDB48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006633] disabled:opacity-50"
          >
            {isPending ? "Wird angemeldet..." : "Anmelden"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Noch nicht Mitglied?{' '}
          <a href="/auth/register" className="font-semibold text-[#006633] hover:text-[#2CDB48]">
            Start hier
          </a>
        </p>
      </div>
    </div>
  );
};