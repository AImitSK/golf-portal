"use server";

import sanityClient from "@/lib/sanityClient";

export const reset = async (values: { email: string }) => {
  try {
    const existingUser = await sanityClient.fetch(
      `*[_type == "administrator" && email == $email][0]`,
      { email: values.email }
    );

    if (!existingUser) {
      return { error: "Email nicht gefunden!" };
    }

    // TODO: Implement password reset token generation and email sending
    // For now, just return success
    return { success: "Reset-Email wurde gesendet!" };
  } catch (error) {
    return { error: "Etwas ist schief gelaufen!" };
  }
};
