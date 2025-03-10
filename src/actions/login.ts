"use server"

import * as z from "zod";
import { LoginSchema } from "@/types/schemas/auth-schemas";
import { signIn } from "@/auth";
import { getRedirectPath } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { UserRole } from "@/types/schemas/auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Invalid Fields!"};
    }

    const {email, password} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Account does not exist!"};
    }

    // Prüfe ob der Account aktiv ist
    if (!existingUser.aktiv) {
        return {error: "Dieser Account ist deaktiviert!"};
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.identifier,
            verificationToken.token
        );

        return {success: "Confirmation email sent!"};
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: getRedirectPath(existingUser.role as UserRole)
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch(error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!"};
                default:
                    return {error: "Something went wrong"};
            }
        }

        throw error;
    }
};