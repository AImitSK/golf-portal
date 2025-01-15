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
            // Geocode-Aktion für Golfclubs
            if (context.schemaType === 'golfclub') {
                return [...prev, GeocodeAction]
            }

            // Berechtigungen für 'like' Dokumente
            if (context.schemaType === 'like') {
                return [
                    ...prev,
                    {
                        name: 'create',
                        title: 'Create',
                        type: 'mutation',
                        handler: async (props) => {
                            console.log('Like document creation attempted', props)
                            return props
                        }
                    }
                ]
            }

            return prev
        },
        // Füge globale Berechtigungsregeln hinzu
        permissions: {
            create: (prev, context) => {
                // Erlaube Erstellung für 'like' Dokumente
                if (context.schemaType === 'like') {
                    return true
                }
                return prev
            }
        }
    }
})