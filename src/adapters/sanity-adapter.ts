import type { SanityClient } from "@sanity/client";
import { uuid } from "@sanity/uuid";
import type {
  Adapter,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters";
import { User, UserRole } from "@/models/typings";

/**
 * In den Adapter-Optionen definieren wir, welche Sanity-Schemas wir haben.
 * Hier: user, administrator, account, verificationToken, session.
 */
export function SanityAdapter(
  sanityClient: SanityClient,
  options = {
    schemas: {
      account: "account",
      verificationToken: "verificationToken",
      user: "user",
      administrator: "administrator",
      session: "session",
    },
  }
): Adapter {
  return {
    /**
     * createUser – erstellt entweder ein `_type: 'administrator'` oder `_type: 'user'`
     * je nachdem, ob user.role === 'admin' (oder UserRole.ADMIN).
     */
    async createUser(user) {
      try {
        // 1) E-Mail checken (ob es schon existiert, in user ODER administrator)
        const existingUser_qry = `*[_type in ["${options.schemas.user}","${options.schemas.administrator}"] && email == "${user.email}"][0]`;
        const existingUser = await sanityClient.fetch(existingUser_qry);
        if (existingUser) return existingUser;

        // 2) Bestimmen, ob wir "administrator" oder "user" anlegen
        //    Falls du in `models/typings` => `export enum UserRole { USER = 'user', ADMIN = 'admin' }`
        const docType =
          user.role === UserRole.ADMIN
            ? options.schemas.administrator
            : options.schemas.user;

        const createdUser = await sanityClient.create({
          _type: docType,
          _id: `${docType}.${uuid()}`,
          role: user.role ?? UserRole.USER, // Default auf normaler User
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified ?? null,
        });

        return {
          id: createdUser._id,
          ...createdUser,
        };
      } catch (error) {
        throw new Error("Failed to Create user");
      }
    },

    /**
     * getUser – holt entweder user ODER administrator (beide in-Array).
     */
    async getUser(id) {
      try {
        const user_qry = `*[_type in ["${options.schemas.user}","${options.schemas.administrator}"] && _id == "${id}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        return user;
      } catch (error) {
        throw new Error("Couldnt get the user");
      }
    },

    /**
     * getUserByEmail – sucht in user + administrator
     */
    async getUserByEmail(email) {
      try {
        const user_qry = `*[_type in ["${options.schemas.user}","${options.schemas.administrator}"] && email == "${email}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        return user;
      } catch (error) {
        throw new Error("Couldnt get the user");
      }
    },

    /**
     * getUserByAccount – findet Account, dann User/Administrator
     */
    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "${options.schemas.account}" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);
        if (!account) return;

        // user könnte _type: 'user' ODER 'administrator' sein
        const user_qry = `*[_type in ["${options.schemas.user}","${options.schemas.administrator}"] && _id == "${account.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        if (!user) return null;

        return {
          id: user._id,
          role: user.role,
          ...user,
        };
      } catch (error) {
        throw new Error("Couldnt get the user");
      }
    },

    /**
     * updateUser – Patch an user- oder administrator-Dokument
     */
    async updateUser(updatedUser) {
      try {
        // existingUser anhand ID abfragen, egal ob user/administrator
        const existingUser_qry = `*[_type in ["${options.schemas.user}","${options.schemas.administrator}"] && _id == "${updatedUser?.id}"][0]`;
        const existingUser = await sanityClient.fetch(existingUser_qry);

        if (!existingUser) {
          throw new Error(
            `Could not update user: ${updatedUser.id}; unable to find user`
          );
        }

        // Patch
        const patchedUser = await sanityClient
          .patch(existingUser._id)
          .set({
            // Wenn updatedUser.emailVerified === null => undefined => "keine Änderung"
            emailVerified:
              updatedUser.emailVerified === null
                ? undefined
                : updatedUser.emailVerified,
            // restliche Felder aus existingUser, falls du es so beibehalten willst
            ...existingUser,
          })
          .commit();

        return patchedUser as any;
      } catch (error) {
        throw new Error("Couldnt update the user");
      }
    },

    /**
     * deleteUser – egal ob user oder administrator, wir löschen per _id
     */
    async deleteUser(userId) {
      try {
        return await sanityClient.delete(userId);
      } catch (error: any) {
        throw new Error("Could not delete user");
      }
    },

    /**
     * linkAccount – unberührt, da hier _type: "account" benutzt wird
     *  und user._id referenziert wird. 
     */
    async linkAccount(account) {
      try {
        const createdAccount = await sanityClient.create({
          _type: options.schemas.account,
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          user: {
            _type: "reference",
            _ref: account.userId,
          },
        });

        const userToUpdate = await sanityClient.getDocument(account.userId);

        await sanityClient.createOrReplace<User>({
          ...userToUpdate,
          emailVerified: new Date().toISOString(),
          accounts: {
            //@ts-ignore
            _type: "reference",
            _key: uuid(),
            _ref: createdAccount._id,
          },
        });

        return account;
      } catch (error) {
        throw new Error("Error linking account");
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "${options.schemas.account}" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);
        if (!account) return;

        const accountUser = await sanityClient.getDocument<User>(account.userId);

        // Filter out the user account to be deleted
        const updatedUserAccounts = (accountUser?.accounts || []).filter(
          (ac) => ac._ref !== account._id
        );

        await sanityClient.createOrReplace({
          ...accountUser,
          accounts: updatedUserAccounts,
        });

        await sanityClient.delete(account._id);
      } catch (error) {
        throw new Error("Could not Unlink account");
      }
    },

    /**
     * createSession – wie gehabt _type: "session"
     */
    async createSession(session) {
      try {
        await sanityClient.create({
          _type: options.schemas.session,
          user: {
            _type: "reference",
            _ref: session.userId,
          },
          ...session,
        });

        return session;
      } catch (error) {
        throw new Error("Error Creating Session");
      }
    },

    /**
     * getSessionAndUser – session und user/administrator abfragen
     */
    async getSessionAndUser(sessionToken: string): Promise<{
      session: AdapterSession;
      user: AdapterUser;
    } | null> {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);
        if (!session) return null;

        // user kann _type: user oder administrator sein
        const user_qry = `*[_type in ["${options.schemas.user}","${options.schemas.administrator}"] && _id == "${session.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        if (!user) return null;

        return {
          session: session,
          user: user,
        };
      } catch (error) {
        throw new Error("Operation Failed");
      }
    },

    async updateSession({ sessionToken }) {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);
        if (!session) return null;

        await sanityClient
          .patch(session._id)
          .set({
            ...session,
          })
          .commit();
      } catch (error) {
        throw new Error("Operation Failed");
      }
    },

    async deleteSession(sessionToken) {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);
        if (!session) return null;

        await sanityClient.delete(session._id);
      } catch (error) {
        throw new Error("Operation Failed");
      }
    },

    /**
     * createVerificationToken, useVerificationToken – unverändert,
     * da du hier ein separates _type: "verificationToken" verwendest.
     */
    async createVerificationToken({ identifier, expires, token }) {
      console.log("createVerificationToken aufgerufen:", {
        identifier,
        expires,
        token,
      });
      return await sanityClient.create({
        _type: options.schemas.verificationToken,
        identifier,
        token,
        expires,
      });
    },

    async useVerificationToken({ identifier, token }) {
      const verToken_qry = `*[_type == "${options.schemas.verificationToken}" && identifier == "${identifier}" && token == "${token}"][0]`;
      const verToken = await sanityClient.fetch(verToken_qry);
      if (!verToken) return null;

      await sanityClient.delete(verToken._id);

      return {
        id: verToken._id,
        ...verToken,
      };
    },
  };
}