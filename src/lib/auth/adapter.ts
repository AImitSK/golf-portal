import type { SanityClient } from '@sanity/client';
import { uuid } from '@sanity/uuid';
import type { Adapter, AdapterUser, AdapterAccount, VerificationToken } from "next-auth/adapters"

export function SanityAdapter(
  client: SanityClient,
  options = {
    schemas: {
      account: 'account',
      verificationToken: 'verificationToken',
      user: 'administrator',
      session: 'session'
    }
  }
): Adapter {
  return {
    async createUser(user) {
      const newUser = {
        _type: options.schemas.user,
        _id: `user-${uuid()}`,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified?.toISOString(),
        role: 'admin', // Default Rolle
        aktiv: true,
        permissions: [] // Leere Berechtigungen standardmäßig
      }
      
      const result = await client.create(newUser)
      return normalizeUser(result)
    },

    async getUser(id) {
      const user = await client.fetch(
        `*[_type == $userType && _id == $id][0]`,
        { userType: options.schemas.user, id }
      )
      if (!user) return null
      return normalizeUser(user)
    },

    async getUserByEmail(email) {
      const user = await client.fetch(
        `*[_type == $userType && email == $email && aktiv == true][0]`,
        { userType: options.schemas.user, email }
      )
      if (!user) return null
      return normalizeUser(user)
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await client.fetch(
        `*[_type == $accountType && provider == $provider && providerAccountId == $providerAccountId][0]{
          "user": *[_type == $userType && _id == ^.userId && aktiv == true][0]
        }`,
        {
          accountType: options.schemas.account,
          userType: options.schemas.user,
          provider,
          providerAccountId
        }
      )
      if (!account?.user) return null
      return normalizeUser(account.user)
    },

    async updateUser(user) {
      const updated = await client.patch(user.id.startsWith('user-') ? user.id : `user-${user.id}`)
        .set({
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .commit()
      return normalizeUser(updated)
    },

    async linkAccount(account) {
      const newAccount = {
        _type: options.schemas.account,
        _id: `account-${uuid()}`,
        userId: account.userId.startsWith('user-') ? account.userId : `user-${account.userId}`,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: account.type,
        refreshToken: account.refresh_token,
        accessToken: account.access_token,
        expiresAt: account.expires_at,
        tokenType: account.token_type,
        scope: account.scope,
        idToken: account.id_token,
        user: {
          _type: 'reference',
          _ref: account.userId.startsWith('user-') ? account.userId : `user-${account.userId}`
        }
      }
      await client.create(newAccount)
      return account
    },

    async createSession(session) {
      const newSession = {
        _type: options.schemas.session,
        _id: `session-${uuid()}`,
        userId: session.userId.startsWith('user-') ? session.userId : `user-${session.userId}`,
        sessionToken: session.sessionToken,
        expires: session.expires.toISOString(),
        user: {
          _type: 'reference',
          _ref: session.userId.startsWith('user-') ? session.userId : `user-${session.userId}`
        }
      }
      await client.create(newSession)
      return session
    },

    async getSessionAndUser(sessionToken) {
      const result = await client.fetch(
        `*[_type == $sessionType && sessionToken == $sessionToken][0]{
          ...,
          "user": *[_type == $userType && _id == ^.userId && aktiv == true][0]
        }`,
        {
          sessionType: options.schemas.session,
          userType: options.schemas.user,
          sessionToken,
        }
      )
      if (!result?.user) return null
      return {
        session: normalizeSession(result),
        user: normalizeUser(result.user),
      }
    },

    async updateSession(session) {
      const sessionId = session.sessionToken.startsWith('session-') ? session.sessionToken : `session-${session.sessionToken}`
      const updated = await client.patch(sessionId)
        .set({
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Tage als Standard
        })
        .commit()
      return normalizeSession(updated)
    },

    async deleteSession(sessionToken) {
      const sessionId = sessionToken.startsWith('session-') ? sessionToken : `session-${sessionToken}`
      await client.delete(sessionId)
    },

    async createVerificationToken(token) {
      const newToken = {
        _type: options.schemas.verificationToken,
        _id: `token-${uuid()}`,
        identifier: token.identifier,
        token: token.token,
        expires: token.expires.toISOString(),
      }
      const result = await client.create(newToken)
      return normalizeVerificationToken(result)
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
    },
  }
}

function normalizeUser(user: any): AdapterUser {
  return {
    id: user._id.replace('user-', ''),
    _type: user._type,
    _id: user._id,
    _rev: user._rev,
    _createdAt: user._createdAt,
    _updatedAt: user._updatedAt,
    email: user.email,
    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
    name: user.name,
    image: user.image,
    role: user.role,
    permissions: user.permissions,
    aktiv: user.aktiv
  }
}

function normalizeSession(session: any) {
  return {
    sessionToken: session.sessionToken,
    userId: session.userId.replace('user-', ''),
    expires: new Date(session.expires),
  }
}

function normalizeVerificationToken(token: any): VerificationToken {
  return {
    identifier: token.identifier,
    token: token.token,
    expires: new Date(token.expires),
  }
}