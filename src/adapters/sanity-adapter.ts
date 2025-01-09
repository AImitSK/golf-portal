import type { SanityClient } from '@sanity/client';
import { uuid } from '@sanity/uuid';
import type {
  Adapter,
  AdapterSession,
  AdapterUser as BaseAdapterUser,
} from "@auth/core/adapters"

// Erweitern des AdapterUser Typs
interface AdapterUser extends BaseAdapterUser {
  _type: string;
  _id: string;
  role: string;
  aktiv: boolean;
  createdAt: string;
  updatedAt: string;
}

export function SanityAdapter(
  sanityClient: SanityClient,
  options = {
    schemas: {
      account: 'account',
      verificationToken: 'verificationToken',
      administrator: 'administrator',
      session: 'session'
    }
  }
): Adapter {
  return {
    async createUser(user) {
      try {
        const existingUser_qry = `*[_type == "${options.schemas.administrator}" && email == "${user.email}"][0]`;
        const existingUser = await sanityClient.fetch(existingUser_qry);

        if(existingUser) {
          return {
            id: existingUser._id,
            _id: existingUser._id,
            _type: existingUser._type,
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
            emailVerified: existingUser.emailVerified ? new Date(existingUser.emailVerified) : null,
            role: existingUser.role,
            aktiv: existingUser.aktiv,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt
          } as AdapterUser;
        }

        const now = new Date().toISOString();
        const createdUser = await sanityClient.create({
          _type: options.schemas.administrator,
          _id: `administrator.${uuid()}`,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified?.toISOString(),
          role: 'user',
          aktiv: true,
          createdAt: now,
          updatedAt: now
        });

        return {
          id: createdUser._id,
          _id: createdUser._id,
          _type: createdUser._type,
          name: createdUser.name,
          email: createdUser.email,
          image: createdUser.image,
          emailVerified: createdUser.emailVerified ? new Date(createdUser.emailVerified) : null,
          role: createdUser.role,
          aktiv: createdUser.aktiv,
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt
        } as AdapterUser;
      } catch (error) {
        throw new Error('Failed to Create user')
      }
    },

    async getUser(id) {
      try {
        const user_qry = `*[_type == "${options.schemas.administrator}" && _id== "${id}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        if (!user) return null;
        return {
          id: user._id,
          _id: user._id,
          _type: user._type,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          role: user.role,
          aktiv: user.aktiv,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user:", error);
        return null;
      }
    },

    async getUserByEmail(email) {
      try {
        const user_qry = `*[_type == "${options.schemas.administrator}" && email == "${email}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        if (!user) return null;
        return {
          id: user._id,
          _id: user._id,
          _type: user._type,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          role: user.role,
          aktiv: user.aktiv,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "${options.schemas.account}" && providerId == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);

        if (!account) return null;

        const user_qry = `*[_type == "${options.schemas.administrator}" && _id == "${account.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        if (!user) return null;
        return {
          id: user._id,
          _id: user._id,
          _type: user._type,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          role: user.role,
          aktiv: user.aktiv,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user by account:", error);
        return null;
      }
    },

    async updateUser(user) {
      try {
        const updatedUser = await sanityClient.patch(user.id)
          .set({
            ...user,
            emailVerified: user.emailVerified?.toISOString(),
            updatedAt: new Date().toISOString()
          })
          .commit();

        return {
          id: updatedUser._id,
          _id: updatedUser._id,
          _type: updatedUser._type,
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image,
          emailVerified: updatedUser.emailVerified ? new Date(updatedUser.emailVerified) : null,
          role: updatedUser.role,
          aktiv: updatedUser.aktiv,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        } as AdapterUser;
      } catch (error) {
        throw new Error('Failed to Update user')
      }
    },

    async deleteUser(userId) {
      try {
        const user_qry = `*[_type == "${options.schemas.administrator}" && _id == "${userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        if (!user) return null;

        await sanityClient.delete(userId);
        
        // Rückgabe des gelöschten Users mit allen erforderlichen Feldern
        return {
          id: user._id,
          _id: user._id,
          _type: user._type,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          role: user.role,
          aktiv: user.aktiv,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        } as AdapterUser;
      } catch (error) {
        throw new Error('Failed to Delete user')
      }
    },

    async linkAccount(account) {
      try {
        const createdAccount = await sanityClient.create({
          _type: options.schemas.account,
          _id: `account.${uuid()}`,
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        });

        return createdAccount;
      } catch (error) {
        throw new Error('Failed to Link account')
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "${options.schemas.account}" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);

        if (!account) return;

        await sanityClient.delete(account._id);
      } catch (error) {
        throw new Error('Failed to Unlink account')
      }
    },

    async createSession({ sessionToken, userId, expires }) {
      try {
        const createdSession = await sanityClient.create({
          _type: options.schemas.session,
          _id: `session.${uuid()}`,
          userId,
          expires,
          sessionToken,
        });

        return {
          sessionToken: createdSession.sessionToken,
          userId: createdSession.userId,
          expires: createdSession.expires
        } as AdapterSession;
      } catch (error) {
        throw new Error('Failed to Create session')
      }
    },

    async getSessionAndUser(sessionToken) {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        const user_qry = `*[_type == "${options.schemas.administrator}" && _id == "${session.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        if (!user) return null;

        return {
          session: {
            sessionToken: session.sessionToken,
            userId: session.userId,
            expires: session.expires
          } as AdapterSession,
          user: {
            id: user._id,
            _id: user._id,
            _type: user._type,
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
            role: user.role,
            aktiv: user.aktiv,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          } as AdapterUser
        };
      } catch (error) {
        return null;
      }
    },

    async updateSession({ sessionToken, expires }) {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        const updatedSession = await sanityClient.patch(session._id)
          .set({ expires })
          .commit();

        return {
          sessionToken: updatedSession.sessionToken,
          userId: updatedSession.userId,
          expires: updatedSession.expires
        } as AdapterSession;
      } catch (error) {
        throw new Error('Failed to Update session')
      }
    },

    async deleteSession(sessionToken) {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        await sanityClient.delete(session._id);
        
        return {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires
        } as AdapterSession;
      } catch (error) {
        throw new Error('Failed to Delete session')
      }
    },

    async createVerificationToken({ identifier, expires, token }) {
      try {
        const createdVerificationToken = await sanityClient.create({
          _type: options.schemas.verificationToken,
          _id: `verificationToken.${uuid()}`,
          identifier,
          token,
          expires,
        });

        return createdVerificationToken;
      } catch (error) {
        throw new Error('Failed to Create verification token')
      }
    },

    async useVerificationToken({ identifier, token }) {
      try {
        const verificationToken_qry = `*[_type == "${options.schemas.verificationToken}" && identifier == "${identifier}" && token == "${token}"][0]`;
        const verificationToken = await sanityClient.fetch(verificationToken_qry);

        if (!verificationToken) return null;

        await sanityClient.delete(verificationToken._id);

        return verificationToken;
      } catch (error) {
        throw new Error('Failed to Use verification token')
      }
    },
  }
}
