import type { SanityClient } from "@sanity/client";
import { uuid } from "@sanity/uuid";
import type {
  Adapter,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters";
import { UserRole } from "@/models/typings";
import { SanityAdapterUser, SanityUserCreate } from "@/types/schemas/auth";

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
    async createUser(user): Promise<SanityAdapterUser> {
      try {
        const existingUser_qry = `*[_type in ["${options.schemas.user}","${options.schemas.administrator}"] && email == "${user.email}"][0]`;
        const existingUser = await sanityClient.fetch<SanityAdapterUser>(existingUser_qry);
        if (existingUser) return existingUser;

        const docType =
            user.role === UserRole.ADMIN
                ? options.schemas.administrator
                : options.schemas.user;

        const userToCreate: SanityUserCreate = {
          _type: docType,
          _id: `${docType}.${uuid()}`,
          id: `${docType}.${uuid()}`,
          role: user.role ?? UserRole.USER,
          name: user.name ?? "",
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          aktiv: true, // Standardwert
        };

        const createdUser = await sanityClient.create(userToCreate);

        return {
          ...createdUser,
          id: createdUser._id,
        } as SanityAdapterUser;
      } catch {
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
      } catch {
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
      } catch {
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
      } catch {
        throw new Error("Couldnt get the user");
      }
    },

    /**
     * updateUser – Patch an user- oder administrator-Dokument
     */
    async updateUser(updatedUser): Promise<SanityAdapterUser> {
      try {
        const existingUser_qry = `*[_type in ["${options.schemas.user}","${options.schemas.administrator}"] && _id == "${updatedUser?.id}"][0]`;
        const existingUser = await sanityClient.fetch<SanityAdapterUser>(existingUser_qry);

        if (!existingUser) {
          throw new Error(
              `Could not update user: ${updatedUser.id}; unable to find user`
          );
        }

        const updatedFields = {
          ...existingUser,
          emailVerified: updatedUser.emailVerified === null
              ? undefined
              : updatedUser.emailVerified,
          name: updatedUser.name ?? existingUser.name,
          email: updatedUser.email ?? existingUser.email,
          image: updatedUser.image ?? existingUser.image,
        };

        const patchedUser = await sanityClient
            .patch(existingUser._id)
            .set(updatedFields)
            .commit();

        return {
          ...patchedUser,
          id: patchedUser._id,
        } as SanityAdapterUser;
      } catch {
        throw new Error("Couldn't update the user");
      }
    },

    /**
     * deleteUser – egal ob user oder administrator, wir löschen per _id
     */
    async deleteUser(userId) {
    try {
      return await sanityClient.delete(userId);
    } catch {
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
          _id: `account.${uuid()}`,
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

        const userToUpdate = await sanityClient.getDocument<SanityAdapterUser>(account.userId);
        if (!userToUpdate?._id) throw new Error("User not found");

        await sanityClient.patch(userToUpdate._id)
            .set({
              emailVerified: new Date().toISOString(),
              accounts: [
                ...(userToUpdate.accounts || []),
                {
                  _type: "reference",
                  _key: uuid(),
                  _ref: createdAccount._id,
                }
              ]
            })
            .commit();

        return account;
      } catch {
        throw new Error("Error linking account");
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "${options.schemas.account}" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);
        if (!account) return;

        const accountUser = await sanityClient.getDocument<SanityAdapterUser>(account.userId);
        if (!accountUser?._id) return;

        await sanityClient
            .patch(accountUser._id)
            .set({
              accounts: (accountUser.accounts || []).filter(
                  (ac) => ac._ref !== account._id
              )
            })
            .commit();

        await sanityClient.delete(account._id);
      } catch {
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
      } catch {
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
      } catch  {
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
      } catch  {
        throw new Error("Operation Failed");
      }
    },

    async deleteSession(sessionToken) {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);
        if (!session) return null;

        await sanityClient.delete(session._id);
      } catch {
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