import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import { SanityAdapter } from "@/adapters/sanity-adapter"
import sanityClient from "@/lib/sanityClient"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/types/schemas/auth-schemas"
import bcrypt from "bcryptjs";

import { getUserById } from "@/data/user"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";


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
         //if not using zod resolvers validated fields arent necessary
         const validatedFields = LoginSchema.safeParse(credentials);
         if(!validatedFields.success) return null;
 
         const user_qry =  `*[(_type == "user" || _type == "administrator") && email== "${credentials?.email}"][0]`;         const user = await sanityClient.fetch(user_qry);
 
         if (!user || !user.password) return null;
 
         const passwordsMatch = await bcrypt.compare(credentials?.password as string, user.password);
   
         if (passwordsMatch) {
           return {
             id: user._id,
             role: user.role,
             ...user
           };
         } 
         
         return null;
      }
    })
  ],
  session: { strategy: "jwt"},
  adapter: SanityAdapter(sanityClient),
  callbacks: {
    async signIn({user, account}) {

      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!)

      // prevent signIn without email verification
      if(!existingUser?.emailVerified) return false;

      // 2FA CHECK
      if(existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser._id);

        if(!twoFactorConfirmation) return false;

        //Delete 2FA for next signin
        await sanityClient.delete(twoFactorConfirmation._id);
      }

      return true
    },
    //@ts-ignore
    async session({ session, token }){

      if(token.sub && session.user) {
        session.user.id = token.sub;
      }

      if(token.role && session.user) {
        session.user.role = token.role;
      }

      if(session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if(session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session
    },
    async jwt({ token }){
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser._id);


      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token;
    },
  },
})