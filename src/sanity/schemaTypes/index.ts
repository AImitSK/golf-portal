// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import golfclub from './golfclub'
import administrator from './administrator'
import vertragsmodell from './vertragsmodell'
import feature from './feature'
import land from './land'
import kooperation from './kooperation'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    golfclub,
    administrator,
    vertragsmodell,
    feature,
    land,
    kooperation,
  ],
}