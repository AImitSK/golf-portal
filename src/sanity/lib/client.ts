// lib/sanity/client.ts
import { createClient } from 'next-sanity'
import { SanityAdapter } from 'next-auth-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const adapter = SanityAdapter(client)