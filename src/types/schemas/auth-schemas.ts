import * as z from "zod";
import { UserRole } from './auth';

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Gültige Email-Adresse erforderlich"
  }),
  password: z.string().min(1, {
    message: "Passwort ist erforderlich"
  })
});

export const UserRegisterSchema = z.object({
  email: z.string().email({
    message: "Gültige Email-Adresse erforderlich"
  }),
  password: z.string().min(6, {
    message: "Passwort muss mindestens 6 Zeichen lang sein"
  }),
  name: z.string().min(1, {
    message: "Name ist erforderlich"
  }),
  role: z.literal("user").default("user")
});

export const AdminRegisterSchema = z.object({
  email: z.string().email({
    message: "Gültige Email-Adresse erforderlich"
  }),
  password: z.string().min(6, {
    message: "Passwort muss mindestens 6 Zeichen lang sein"
  }),
  name: z.string().min(1, {
    message: "Name ist erforderlich"
  }),
  role: z.enum(["club_admin", "developer"]).default("club_admin")
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