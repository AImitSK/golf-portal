"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Button } from '@/components/catalyst-ui-kit/button';
import { Input } from '@/components/catalyst-ui-kit/input';
import { Text } from '@/components/catalyst-ui-kit/text';
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/ui/form-error";
import { FormSuccess } from "@/components/auth/ui/form-success";
import { login } from "@/actions/login";

const formSchema = z.object({
  email: z.string().email({
    message: "Ungültige Email-Adresse",
  }),
  password: z.string().min(1, {
    message: "Passwort wird benötigt",
  }),
});

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email bereits für einen anderen Provider verwendet!"
    : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    setSuccess("");
    setIsPending(true);

    try {
      const result = await login(values);

      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      setError("Etwas ist schief gelaufen!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Willkommen zurück"
      backButtonLabel="Noch kein Konto?"
      backButtonHref="/auth/register"
      showSocial
    >
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <Text as="label" variant="label">Email</Text>
            <Input
              {...form.register("email")}
              disabled={isPending}
              placeholder="john.doe@example.com"
              type="email"
              error={form.formState.errors.email?.message}
            />
          </div>
          <div>
            <Text as="label" variant="label">Passwort</Text>
            <Input
              {...form.register("password")}
              disabled={isPending}
              placeholder="******"
              type="password"
              error={form.formState.errors.password?.message}
            />
          </div>
        </div>
        <FormError message={error || urlError} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          plain
          className="w-full"
          disabled={isPending}
        >
          Anmelden
        </Button>
      </form>
    </CardWrapper>
  );
};
