// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import golfclub from '@/sanity/schemaTypes/golfclub'
import administrator from '@/sanity/schemaTypes/administrator'
import vertragsmodell from '@/sanity/schemaTypes/vertragsmodell'
import feature from '@/sanity/schemaTypes/feature'
import land from '@/sanity/schemaTypes/land'
import kooperation from '@/sanity/schemaTypes/kooperation'
import account from '@/sanity/schemaTypes/account'
import session from '@/sanity/schemaTypes/session'
import verificationToken from '@/sanity/schemaTypes/verificationToken'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    golfclub,
    administrator,
    vertragsmodell,
    feature,
    land,
    kooperation,
    account,
    session,
    verificationToken,
  ],
}