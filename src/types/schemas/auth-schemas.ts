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

// Neue Schemas für Club-Registrierung
const AddressSchema = z.object({
  strasse: z.string().min(1, {
    message: "Straße ist erforderlich"
  }),
  hausnummer: z.string().min(1, {
    message: "Hausnummer ist erforderlich"
  }),
  plz: z.string().regex(/^\d{5}$/, {
    message: "Gültige PLZ erforderlich (5 Ziffern)"
  }),
  ort: z.string().min(1, {
    message: "Ort ist erforderlich"
  })
});

const ClubAdminSchema = z.object({
  email: z.string().email({
    message: "Gültige Email-Adresse erforderlich"
  }),
  password: z.string().min(6, {
    message: "Passwort muss mindestens 6 Zeichen lang sein"
  }),
  name: z.string().min(2, {
    message: "Name ist erforderlich (min. 2 Zeichen)"
  }),
  position: z.string().min(2, {
    message: "Position ist erforderlich (min. 2 Zeichen)"
  })
});

const ClubDetailsSchema = z.object({
  name: z.string().min(2, {
    message: "Clubname ist erforderlich (min. 2 Zeichen)"
  }),
  email: z.string().email({
    message: "Gültige Club Email-Adresse erforderlich"
  }),
  website: z.string().url({
    message: "Gültige URL erforderlich"
  }).optional(),
  telefon: z.string().optional()
});

export const ClubRegisterSchema = z.object({
  admin: ClubAdminSchema,
  club: ClubDetailsSchema,
  adresse: AddressSchema
});


// Type Exports
export type ClubRegisterInput = z.infer<typeof ClubRegisterSchema>;
export type ClubDetailsInput = z.infer<typeof ClubDetailsSchema>;
export type ClubAdminInput = z.infer<typeof ClubAdminSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;

export const ClaimClubSchema = z.object({
  admin: z.object({
    email: z.string().email("Gültige E-Mail-Adresse erforderlich"),
    password: z.string().min(8, "Mindestens 8 Zeichen"),
    name: z.string().min(2, "Name erforderlich"),
    position: z.string().min(2, "Position erforderlich"),
  }),
  claim: z.object({
    clubId: z.string().min(1, "Club ID erforderlich"),
    verificationCode: z.string().optional(),
  })
});