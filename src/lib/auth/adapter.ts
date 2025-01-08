import { client } from '@/lib/sanity/client';
import { uuid } from '@sanity/uuid';

import type {
  Adapter,
  AdapterSession,
  AdapterUser,
} from 'next-auth/adapters';
import { User, UserRole } from '@/types/auth';

export function SanityAdapter(
  options = {
    schemas: {
      administrator: 'administrator',
      account: 'account',
      verificationToken: 'verificationToken',
      session: 'session'
    }
  }
): Adapter {
  return {
    async createUser(user) {
      try {
        const existingUser_qry = `*[_type == "administrator" && email == "${user.email}"][0]`;
        const existingUser = await client.fetch(existingUser_qry);

        if (existingUser) return existingUser;

        const createdUser = await client.create({
          _type: options.schemas.administrator,
          _id: `user.${uuid()}`,
          role: UserRole.ADMIN,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          aktiv: true
        });

        return {
          id: createdUser._id,
          ...createdUser
        };
      } catch (error) {
        throw new Error('Failed to Create user');
      }
    },

    async getUser(id) {
      try {
        const user_qry = `*[_type == "administrator" && _id == "${id}"][0]`;
        const user = await client.fetch(user_qry);

        return user;
      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async getUserByEmail(email) {
      try {
        const user_qry = `*[_type == "administrator" && email == "${email}" && aktiv == true][0]`;
        const user = await client.fetch(user_qry);

        return user;
      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "account" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await client.fetch(account_qry);

        if (!account) return null;

        const user_qry = `*[_type == "administrator" && _id == "${account.userId}"][0]`;
        const user = await client.fetch(user_qry);

        return {
          id: user._id,
          role: user.role,
          ...user
        };
      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async updateUser(updatedUser) {
      try {
        const existingUser_qry = `*[_type == "administrator" && _id == "${updatedUser?.id}"][0]`;
        const existingUser = await client.fetch(existingUser_qry);

        if (!existingUser) {
          throw new Error(`Could not update user: ${updatedUser.id}; unable to find user`);
        }

        const patchedUser = await client.patch(existingUser._id)
          .set({
            emailVerified: updatedUser.emailVerified === null ? undefined : updatedUser.emailVerified,
            ...existingUser
          })
          .commit();

        return patchedUser;
      } catch (error) {
        throw new Error('Couldnt update the user');
      }
    },

    async deleteUser(userId) {
      try {
        return await client.delete(userId);
      } catch (error) {
        throw new Error('Could not delete user');
      }
    },

    async linkAccount(account) {
      try {
        const createdAccount = await client.create({
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
            _type: 'reference',
            _ref: account.userId
          }
        });

        const userToUpdate = await client.getDocument(account.userId);

        // @ts-ignore
        await client.createOrReplace({
          ...userToUpdate,
          emailVerified: new Date().toISOString(),
          accounts: {
            _type: 'reference',
            _key: uuid(),
            _ref: createdAccount._id
          }
        });

        return account;
      } catch (error) {
        throw new Error('Error linking account');
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "account" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await client.fetch(account_qry);

        if (!account) return;

        const accountUser = await client.getDocument(account.userId);

        const updatedUserAccounts = (accountUser?.accounts || []).filter(
          ac => ac._ref !== account._id
        );

        // @ts-ignore
        await client.createOrReplace({
          ...accountUser,
          accounts: updatedUserAccounts
        });

        await client.delete(account._id);
      } catch (error) {
        throw new Error('Could not Unlink account');
      }
    },

    async createSession(session) {
      try {
        await client.create({
          _type: options.schemas.session,
          user: {
            _type: 'reference',
            _ref: session.userId
          },
          ...session
        });

        return session;
      } catch (error) {
        throw new Error('Error Creating Session');
      }
    },

    async getSessionAndUser(sessionToken) {
      try {
        const session_qry = `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await client.fetch(session_qry);

        if (!session) return null;

        const user_qry = `*[_type == "administrator" && _id == "${session.userId}"][0]`;
        const user = await client.fetch(user_qry);

        return {
          session,
          user
        };
      } catch (error) {
        throw new Error('Operation Failed');
      }
    },

    async updateSession({ sessionToken }) {
      try {
        const session_qry = `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await client.fetch(session_qry);

        if (!session) return null;

        await client.patch(session._id)
          .set({
            ...session
          })
          .commit();
      } catch (error) {
        throw new Error('Operation Failed');
      }
    },

    async deleteSession(sessionToken) {
      try {
        const session_qry = `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await client.fetch(session_qry);

        if (!session) return null;

        await client.delete(session._id);
      } catch (error) {
        throw new Error('Operation Failed');
      }
    },

    async createVerificationToken({ identifier, expires, token }) {
      const verificationToken = await client.create({
        _type: options.schemas.verificationToken,
        identifier,
        token,
        expires
      });

      return verificationToken;
    },

    async useVerificationToken({ identifier, token }) {
      const verToken_qry = `*[_type == "verificationToken" && identifier == "${identifier}" && token == "${token}"][0]`;
      const verToken = await client.fetch(verToken_qry);

      if (!verToken) return null;

      await client.delete(verToken._id);

      return {
        id: verToken._id,
        ...verToken
      };
    }
  };
}