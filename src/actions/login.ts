"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (
  values: { 
    email: string; 
    password: string;
  }
) => {
  try {
    await signIn("credentials", {
      ...values,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Ungültige Anmeldedaten!" };
        default:
          return { error: "Etwas ist schief gelaufen!" };
      }
    }
    throw error;
  }
};
