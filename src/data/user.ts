import sanityClient from "@/lib/sanityClient";

export const getUserByEmail = async (email: string) => {
    try {
        // Suche in beiden Schemas (user und administrator)
        const query = `*[(_type == "user" || _type == "administrator") && email == "${email}"][0]`;
        const user = await sanityClient.fetch(query);
        return user;
    } catch {
        return null;
    }
}

export const getUserById = async (_id: string) => {
    try {
        // Auch hier beide Schemas berücksichtigen
        const query = `*[(_type == "user" || _type == "administrator") && _id == "${_id}"][0]`;
        const user = await sanityClient.fetch(query);
        return user;
    } catch {
        return null;
    }
}