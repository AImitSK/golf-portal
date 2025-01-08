"use server";

import bcrypt from "bcryptjs";
import sanityClient from "@/lib/sanityClient";

export const register = async (values: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    // Check if email is already in use
    const existingUser = await sanityClient.fetch(
      `*[_type == "administrator" && email == $email][0]`,
      { email: values.email }
    );

    if (existingUser) {
      return { error: "Email wird bereits verwendet!" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(values.password, 10);

    // Create user in Sanity
    await sanityClient.create({
      _type: "administrator",
      email: values.email,
      name: values.name,
      password: hashedPassword,
      role: "user",
      aktiv: true,
    });

    return { success: "Benutzer erfolgreich registriert!" };
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return { error: "Etwas ist schief gelaufen!" };
  }
};
