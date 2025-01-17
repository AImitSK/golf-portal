"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";
import { uuid } from '@sanity/uuid';

import { AdminRegisterSchema } from "@/types/schemas/auth-schemas";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import sanityClient from "@/lib/sanityClient";

const getUserByEmail = async (email: string) => {
  const query = `*[_type == "administrator" && email == $email][0]`;
  return await sanityClient.fetch(query, { email });
};

export const registerAdmin = async (values: z.infer<typeof AdminRegisterSchema>) => {
    const validatedFields = AdminRegisterSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Ungültige Eingaben"};
    }

    const {email, password, name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if(existingUser) {
        return {error: "Diese Email-Adresse wird bereits verwendet"};
    }

    try {
        // Erstelle neuen User in Sanity
        await sanityClient.create({
            _type: 'administrator',
            _id: `user.${uuid()}`,
            name,
            email,
            role: 'admin', // für Golf-Club-Besitzer
            isTwoFactorEnabled: false,
            password: hashedPassword,
            emailVerified: null
        });

        // Generiere Verifikations-Token
        const verificationToken = await generateVerificationToken(email);

        // Sende Verifikations-Email
        await sendVerificationEmail(
            verificationToken.identifier,
            verificationToken.token
        );

        return { success: "Bestätigungs-Email wurde versendet" };
    } catch (error) {
        return { error: "Ein Fehler ist aufgetreten" };
    }
};