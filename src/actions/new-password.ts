"use server";

import bcrypt from "bcryptjs";
import sanityClient from "@/lib/sanityClient";

export type NewPasswordResponse = {
  error?: string;
  success?: string;
};

export const newPassword = async (
  values: { password: string },
  token: string | null
): Promise<NewPasswordResponse> => {
  if (!token) {
    return { error: "Fehlender Token!" };
  }

  try {
    // TODO: Implement token validation
    // For now, just return error
    return { error: "Token ungültig oder abgelaufen!" };

    // When implemented, it should:
    // 1. Validate the reset token
    // 2. Find the user associated with the token
    // 3. Hash the new password
    // 4. Update the user's password in Sanity
    // 5. Remove the reset token
    // 6. Return success message
  } catch (error) {
    return { error: "Etwas ist schief gelaufen!" };
  }
};
