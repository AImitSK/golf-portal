"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schemas und Actions
import { AdminRegisterSchema } from "@/types/schemas/auth-schemas";
import { registerAdmin } from "@/actions/registerAdmin";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AdminRegisterSchema>>({
    resolver: zodResolver(AdminRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "admin", // Default Role für Golf-Club-Besitzer
    },
  });

  const onSubmit = (values: z.infer<typeof AdminRegisterSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(() => {
      registerAdmin(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Golf Club Logo"
          src="/logo-c-list-green.svg"
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Als Golfclub registrieren
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
              Name
            </label>
            <div className="mt-2">
              <input
                {...form.register("name")}
                id="name"
                type="text"
                autoComplete="name"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#006633] sm:text-sm/6"
                placeholder="Max Mustermann"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email Adresse
            </label>
            <div className="mt-2">
              <input
                {...form.register("email")}
                id="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#006633] sm:text-sm/6"
                placeholder="max.mustermann@golfclub.de"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Passwort
              </label>
            </div>
            <div className="mt-2">
              <input
                {...form.register("password")}
                id="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#006633] sm:text-sm/6"
              />
            </div>
          </div>

          {/* Error und Success Messages */}
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center rounded-md bg-[#006633] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#2CDB48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006633]"
            >
              Registrieren
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Bereits registriert?{' '}
          <a href="/auth/login" className="font-semibold text-[#006633] hover:text-[#2CDB48]">
            Zum Login
          </a>
        </p>
      </div>
    </div>
  );
};