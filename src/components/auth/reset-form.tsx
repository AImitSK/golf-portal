"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reset } from "@/actions/reset";
import { ResetSchema } from "@/schemas";
import { Input } from "@/components/catalyst-ui-kit/input";
import { Button } from "@/components/catalyst-ui-kit/button";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/ui/form-error";
import { FormSuccess } from "@/components/auth/ui/form-success";

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
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Passwort vergessen?"
      backButtonLabel="Zurück zum Login"
      backButtonHref="/auth/login"
    >
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <Input
            {...form.register("email")}
            disabled={isPending}
            placeholder="john.doe@example.com"
            type="email"
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          disabled={isPending}
          type="submit"
          className="w-full"
        >
          Link zum Zurücksetzen senden
        </Button>
      </form>
    </CardWrapper>
  );
};
