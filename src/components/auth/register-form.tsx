"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/catalyst-ui-kit/button';
import { Input } from '@/components/catalyst-ui-kit/input';
import { Text } from '@/components/catalyst-ui-kit/text';
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/ui/form-error";
import { FormSuccess } from "@/components/auth/ui/form-success";
import { register } from "@/actions/register";

const formSchema = z.object({
  email: z.string().email({
    message: "Ungültige Email-Adresse",
  }),
  password: z.string().min(6, {
    message: "Mindestens 6 Zeichen",
  }),
  name: z.string().min(1, {
    message: "Name wird benötigt",
  }),
});

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    setSuccess("");
    setIsPending(true);

    try {
      const result = await register(values);

      if (result?.error) {
        setError(result.error);
      }

      if (result?.success) {
        setSuccess(result.success);
        form.reset();
      }
    } catch (error) {
      setError("Etwas ist schief gelaufen!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Konto erstellen"
      backButtonLabel="Bereits registriert?"
      backButtonHref="/auth/login"
      showSocial
    >
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <Text as="label" variant="label">Name</Text>
            <Input
              {...form.register("name")}
              disabled={isPending}
              placeholder="John Doe"
              error={form.formState.errors.name?.message}
            />
          </div>
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
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          plain
          className="w-full"
          disabled={isPending}
        >
          Registrieren
        </Button>
      </form>
    </CardWrapper>
  );
};
