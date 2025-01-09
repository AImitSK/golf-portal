import type { SanityClient } from '@sanity/client';
import { uuid } from '@sanity/uuid';
import type {
  Adapter,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters"

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

        if(existingUser) return existingUser;

        const createdUser = await sanityClient.create({
          _type: options.schemas.administrator,
          _id: `administrator.${uuid()}`,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified
        });

        return {
          id: createdUser._id,
          ...createdUser
        };
      } catch (error) {
        throw new Error('Failed to Create user')
      }
    },

    async getUser(id) {
      try {
        const user_qry = `*[_type == "${options.schemas.administrator}" && _id== "${id}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        return user;
      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async getUserByEmail(email) {
      try {
        const user_qry = `*[_type == "${options.schemas.administrator}" && email== "${email}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        return user;
      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "${options.schemas.account}" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);

        if (!account) return null;

        const user_qry = `*[_type == "${options.schemas.administrator}" && _id== "${account.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        return user ? {
          id: user._id,
          ...user
        } : null;
      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async updateUser(updatedUser) {
      try {
        const existingUser_qry = `*[_type == "${options.schemas.administrator}" && _id == "${updatedUser?.id}"][0]`;
        const existingUser = await sanityClient.fetch(existingUser_qry);

        if(!existingUser) {
          throw new Error(`Could not update user: ${updatedUser.id}; unable to find user`)
        }

        const patchedUser = await sanityClient.patch(existingUser._id)
          .set({
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
            emailVerified: updatedUser.emailVerified === null ? undefined : updatedUser.emailVerified,
          })
          .commit();

        return patchedUser;
      } catch (error) {
        throw new Error('Couldnt update the user');
      }
    },

    async deleteUser(userId) {
      try {
        return await sanityClient.delete(userId);
      } catch (error) {
        throw new Error('Could not delete user')
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

        const userToUpdate = await sanityClient.getDocument(account.userId);

        if (!userToUpdate?._id) {
          throw new Error('User not found');
        }

        await sanityClient.createOrReplace({
          _id: userToUpdate._id,
          _type: userToUpdate._type,
          ...userToUpdate,
          accounts: [
            ...(userToUpdate?.accounts || []),
            {
              _type: 'reference',
              _key: uuid(),
              _ref: createdAccount._id
            }
          ]
        });

        return account;
      } catch (error) {
        throw new Error('Error linking account')
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        const account_qry = `*[_type == "${options.schemas.account}" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);

        if (!account) return;

        const accountUser = await sanityClient.getDocument(account.userId);

        const updatedUserAccounts = (accountUser?.accounts || []).filter(
          ac => ac._ref !== account._id
        );

        await sanityClient.createOrReplace({
          ...accountUser,
          accounts: updatedUserAccounts,
        });

        await sanityClient.delete(account._id);
      } catch (error) {
        throw new Error('Could not Unlink account');
      }
    },

    async createSession(session) {
      try {
        const createdSession = await sanityClient.create({
          _type: options.schemas.session,
          _id: `session.${uuid()}`,
          userId: session.userId,
          sessionToken: session.sessionToken,
          expires: session.expires,
          user: {
            _type: 'reference',
            _ref: session.userId
          }
        });

        return {
          id: createdSession._id,
          ...createdSession
        };
      } catch (error) {
        throw new Error('Could not create session')
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
            id: session._id,
            ...session
          },
          user: {
            id: user._id,
            ...user
          }
        };
      } catch (error) {
        throw new Error('Could not get session and user')
      }
    },

    async updateSession(session) {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${session.sessionToken}"][0]`;
        const existingSession = await sanityClient.fetch(session_qry);

        if (!existingSession) return null;

        const updatedSession = await sanityClient.patch(existingSession._id)
          .set({
            expires: session.expires
          })
          .commit();

        return updatedSession;
      } catch (error) {
        throw new Error('Could not update session')
      }
    },

    async deleteSession(sessionToken) {
      try {
        const session_qry = `*[_type == "${options.schemas.session}" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (session) {
          await sanityClient.delete(session._id);
        }
      } catch (error) {
        throw new Error('Could not delete session')
      }
    }
  };
}
