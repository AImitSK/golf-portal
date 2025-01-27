// src/sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import golfclub from './golfclub'
import administrator from './administrator'
import vertragsmodell from './vertragsmodell'
import feature from './feature'
import land from './land'
import kooperation from './kooperation'
import user from './user'
import like from './like'
import wishlist from './wishlist'
import coursePlayed from './coursePlayed'
import claimLog from './claimLog'
import golfCourse from './golfCourse'
import playedRound from "@/sanity/schemaTypes/playedRound";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    golfclub,
    administrator,
    vertragsmodell,
    feature,
    land,
    kooperation,
    user,
    like,
    wishlist,
    claimLog,
    coursePlayed,
    golfCourse,
    playedRound
  ],
}