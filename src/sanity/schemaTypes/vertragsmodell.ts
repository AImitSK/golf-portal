import type { SanityRule } from '@/types/sanity-types';

const vertragsmodellSchema = {
    name: 'vertragsmodell',
    title: 'Vertragsmodell',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule: SanityRule) => rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96
            }
        },
        {
            name: 'beschreibung',
            title: 'Beschreibung',
            type: 'text'
        },
        {
            name: 'grafik',
            title: 'Grafik',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'stripeProductId',
            title: 'Stripe Product ID',
            type: 'string',
            validation: (rule: SanityRule) => rule.required()
        },
        {
            name: 'stripePriceId',
            title: 'Stripe Price ID',
            type: 'string',
            validation: (rule: SanityRule) => rule.required()
        },
        {
            name: 'preis',
            title: 'Preis',
            type: 'number',
            readOnly: true
        },
        {
            name: 'waehrung',
            title: 'Währung',
            type: 'string',
            readOnly: true
        },
        {
            name: 'zahlungsintervall',
            title: 'Zahlungsintervall',
            type: 'string',
            options: {
                list: ['monatlich', 'jährlich']
            }
        },
        {
            name: 'isTopPosition',
            title: 'TOP Position',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'supportLevel',
            title: 'Support Level',
            type: 'string',
            options: {
                list: [
                    { title: 'Basic Support', value: 'basic' },
                    { title: 'Premium Support', value: 'premium' },
                    { title: 'Premium Plus Support', value: 'premium_plus' }
                ]
            }
        },
        {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'feature',
                        title: 'Feature',
                        type: 'reference',
                        to: [{ type: 'feature' }],
                        validation: (rule: SanityRule) => rule.required()
                    },
                    {
                        name: 'limit',
                        title: 'Limit',
                        type: 'number',
                        initialValue: 0,
                        validation: (rule: SanityRule) => rule.required(),
                        description: '0 = deaktiviert, 1 = aktiviert (bei boolean), Anzahl (bei counter)'
                    }
                ],
                preview: {
                    select: {
                        featureName: 'feature.name',
                        limit: 'limit'
                    },
                    prepare: ({ featureName, limit }: { featureName: string; limit: number }) => ({
                        title: featureName,
                        subtitle: `Limit: ${limit}`
                    })
                }
            }]
        }
    ]
};

export default vertragsmodellSchema;