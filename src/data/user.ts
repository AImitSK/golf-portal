// src/data/user.ts
import sanityClient from "@/lib/sanityClient";

export const getUserByEmail = async (email: string) => {
    if (!email) {
        console.warn("getUserByEmail called without email");
        return null;
    }

    try {
        const query = '*[(_type == "user" || _type == "administrator") && email == $email][0]';
        const user = await sanityClient.fetch(query, { email });
        return user || null;
    } catch (error) {
        console.error("Error in getUserByEmail:", error);
        return null;
    }
};

export const getUserById = async (id: string) => {
    if (!id) {
        console.warn("getUserById called without id");
        return null;
    }

    try {
        console.log("Getting user by id:", id);

        // Aktualisierte Query, die image als String behandelt
        const query = `*[(_type == "user" || _type == "administrator") && _id == $id][0]{
            _id,
            _type,
            name,
            email,
            role,
            aktiv,
            image
        }`;

        const params = { id };

        const user = await sanityClient.fetch(query, params);

        if (!user) {
            console.warn(`No user found with id: ${id}`);
            return null;
        }

        return {
            ...user,
            // Ensure required fields have default values
            role: user.role || "user",
            _type: user._type || "user",
            aktiv: user.aktiv ?? true,
        };
    } catch (error) {
        console.error("Error in getUserById:", error);
        return null;
    }
};