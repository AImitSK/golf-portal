import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Gültige Email-Adresse erforderlich"
  }),
  password: z.string().min(1, {
    message: "Passwort ist erforderlich"
  })
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Gültige Email-Adresse erforderlich"
  }),
  password: z.string().min(6, {
    message: "Passwort muss mindestens 6 Zeichen lang sein"
  }),
  name: z.string().min(1, {
    message: "Name ist erforderlich"
  }),
  role: z.enum(["user", "admin"]).default("admin") // Automatisch ADMIN für Golf-Club-Besitzer
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Gültige Email-Adresse erforderlich"
  })
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Passwort muss mindestens 6 Zeichen lang sein"
  })
});