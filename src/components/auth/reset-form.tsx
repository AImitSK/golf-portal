// src/components/auth/reset-form.tsx
"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schemas und Actions
import { ResetSchema } from "@/types/schemas/auth-schemas";
import { reset } from "@/actions/reset";

// Catalyst UI Components
import { Button } from "@/components/catalyst-ui-kit";
import { InputWrapper } from "@/components/auth/input-wrapper";

// Auth Components
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Passwort vergessen?"
      backButtonLabel="Zurück zum Login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="space-y-4">
          <InputWrapper
            {...form.register("email")}
            type="email"
            label="Email"
            placeholder="max.mustermann@golfclub.de"
            error={form.formState.errors.email?.message}
            disabled={isPending}
          />
        </div>

        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        
        <Button
          type="submit"
          disabled={isPending}
          color="blue"
          className="w-full"
        >
          Link zum Zurücksetzen senden
        </Button>
      </form>
    </CardWrapper>
  );
};