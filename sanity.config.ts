'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { schema } from '@/sanity/schemaTypes'
import { structure } from '@/sanity/structure'
import { action as GeocodeAction } from '@/sanity/actions/GeocodeAction'

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    schema,
    plugins: [
        structureTool({ structure }),
        visionTool({ defaultApiVersion: apiVersion }),
    ],
    document: {
        actions: (prev, context) => {
            console.log('Document actions called:', {
                schemaType: context.schemaType,
                hasGeocodeAction: !!GeocodeAction
            })

            if (context.schemaType === 'golfclub') {
                return [...prev, GeocodeAction]
            }
            return prev
        }
    }
})