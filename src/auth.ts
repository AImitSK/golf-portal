import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { SanityAdapter } from "@/adapters/sanity-adapter"
import sanityClient from "@/lib/sanityClient"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/types/schemas/auth-schemas"
import bcrypt from "bcryptjs"
import { getUserById } from "@/data/user"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { getAccountByUserId } from "@/data/account"

export const { 
  handlers: { GET, POST }, 
  auth,
  signIn,
  signOut,
  //unstable update in Beta version
  unstable_update
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        try {
          console.log("Starting authorize with email:", credentials?.email);
          const validatedFields = LoginSchema.safeParse(credentials);
          console.log("Validation result:", validatedFields.success);
          if(!validatedFields.success) return null;
   
          const user_qry = `*[(_type == "user" || _type == "administrator") && email== "${credentials?.email}"][0]`;
          const user = await sanityClient.fetch(user_qry);
          console.log("Found user:", user ? { ...user, password: '***' } : null);
   
          if (!user || !user.password) return null;
   
          const passwordsMatch = await bcrypt.compare(
            credentials?.password as string, 
            user.password
          );
          console.log("Password match:", passwordsMatch);
     
          if (passwordsMatch) {
            const returnUser = {
              id: user._id,
              _id: user._id,
              role: user.role,
              _type: user._type,
              aktiv: user.aktiv,
              email: user.email,
              name: user.name
            };
            console.log("Returning user:", returnUser);
            return returnUser;
          }  
          
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  adapter: SanityAdapter(sanityClient),
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id)

      if(!existingUser?.emailVerified) return false;

      if(existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser._id);

        if(!twoFactorConfirmation) return false;

        await sanityClient.delete(twoFactorConfirmation._id);
      }

      return true;
    },
    async session({ session, token }) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
      }

      if(token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user._type = token._type as string;
        session.user._id = token._id as string;
        session.user.aktiv = token.aktiv as boolean;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token }) {
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser._id);

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token._type = existingUser._type;
      token._id = existingUser._id;
      token.aktiv = existingUser.aktiv;

      return token;
    }
  }
})