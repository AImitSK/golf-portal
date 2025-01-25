// schemaTypes/feature.ts
import type { SanityRule } from '@/types/sanity-types';

const featureSchema = {
    name: 'feature',
    title: 'Feature',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule: SanityRule) => rule.required()
        },
        {
            name: 'key',
            title: 'Technischer Schlüssel',
            type: 'string',
            validation: (rule: SanityRule) => rule.required().regex(/^[a-z_]+$/)
        },
        {
            name: 'beschreibung',
            title: 'Beschreibung',
            type: 'text'
        },
        {
            name: 'icon',
            title: 'Feature Icon',
            type: 'string',
            description: 'Icon-Name aus der Lucide Icon Library'
        },
        {
            name: 'typ',
            title: 'Typ',
            type: 'string',
            options: {
                list: [
                    { title: 'Zähler', value: 'counter' },
                    { title: 'Boolean', value: 'boolean' }
                ]
            },
            validation: (rule: SanityRule) => rule.required()
        }
    ]
};

export default featureSchema;

