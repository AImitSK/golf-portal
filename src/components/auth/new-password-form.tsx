"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";
import { NewPasswordSchema } from "@/schemas";
import { Input } from "@/components/catalyst-ui-kit/input";
import { Button } from "@/components/catalyst-ui-kit/button";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/ui/form-error";
import { FormSuccess } from "@/components/auth/ui/form-success";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token)
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
      headerLabel="Neues Passwort erstellen"
      backButtonLabel="Zurück zum Login"
      backButtonHref="/auth/login"
    >
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <Input
            {...form.register("password")}
            disabled={isPending}
            placeholder="******"
            type="password"
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          disabled={isPending}
          type="submit"
          className="w-full"
        >
          Passwort zurücksetzen
        </Button>
      </form>
    </CardWrapper>
  );
};
