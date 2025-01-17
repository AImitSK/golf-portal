"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";
import { uuid } from '@sanity/uuid';

import { UserRegisterSchema } from "@/types/schemas/auth-schemas";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import sanityClient from "@/lib/sanityClient";

const getUserByEmail = async (email: string) => {
  const query = `*[_type == "user" && email == $email][0]`;
  return await sanityClient.fetch(query, { email });
};

export const registerUser = async (values: z.infer<typeof UserRegisterSchema>) => {
    const validatedFields = UserRegisterSchema.safeParse(values);

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
            _type: 'user',
            _id: `user.${uuid()}`,
            name,
            email,
            role: 'user', // für Golf-Club-Besitzer
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