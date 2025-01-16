"use server";

import sanityClient from "@/lib/sanityClient";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  console.log("newVerification() called with token:", token);

  // 1) Token holen
  const existingToken = await getVerificationTokenByToken(token);
  console.log("existingToken:", existingToken);
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  // 2) Ablaufdatum prüfen
  const now = new Date();
  const expires = new Date(existingToken.expires);
  console.log("Current time:", now, "| Token expiry:", expires);

  const hasExpired = expires < now;
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // 3) Benutzer anhand der E-Mail holen
  const existingUser = await getUserByEmail(existingToken.identifier);
  console.log("existingUser:", existingUser);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  // 4) Patch mit try/catch absichern
  try {
    console.log("About to patch user:", existingUser._id, "=> emailVerified");
    const patchResult = await sanityClient
      .patch(existingUser._id)
      .set({
        emailVerified: now.toISOString(),
        email: existingToken.identifier, // ggf. optional
      })
      .commit();

    console.log("Patch result:", patchResult);
  } catch (err) {
    // Hier siehst du im Terminal (oder in Logs), warum das Patch ggf. scheitert
    console.error("Error patching user:", err);
    return { error: "Failed to update emailVerified" };
  }

  // 5) Token löschen, damit es nicht erneut genutzt werden kann
  await sanityClient.delete(existingToken._id);
  console.log("Deleted token doc:", existingToken._id);

  // 6) Erfolgsmeldung
  console.log("Email verified successfully for user:", existingUser._id);
  return { success: "Email verified!" };
};