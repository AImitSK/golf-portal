"use server";

import * as z from "zod";

import { ResetSchema } from "@/form-schemas"; // Import für ResetSchema
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail"; // Import für sendPasswordResetEmail
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
      passwordResetToken.identifier,
      passwordResetToken.token,
  );

  return { success: "Reset password email sent!" };
};
