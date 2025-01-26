'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig, DocumentActionComponent, DocumentActionsContext } from 'sanity';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { schema } from '@/sanity/schemaTypes';
import { structure } from '@/sanity/structure';
import { action as GeocodeAction } from '@/sanity/actions/GeocodeAction';

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
        actions: (prev: DocumentActionComponent[], context: DocumentActionsContext) => {
            // Geocode-Aktion für Golfclubs
            if (context.schemaType === 'golfclub') {
                return [...prev, GeocodeAction];
            }

            // Berechtigungen für 'like' Dokumente
            if (context.schemaType === 'like') {
                const createAction: DocumentActionComponent = (props) => ({
                    name: 'create',
                    title: 'Create',
                    label: 'Erstellen', // Hinzugefügt
                    onHandle: async () => {
                        console.log('Like document creation attempted', props);
                    },
                });
                return [...prev, createAction];
            }

            return prev;
        },
        // Globale Berechtigungsregeln
        permissions: {
            create: (prev: boolean, context: DocumentActionsContext) => {
                // Erlaube Erstellung für 'like' Dokumente
                if (context.schemaType === 'like') {
                    return true;
                }
                return prev;
            },
        },
    },
});
