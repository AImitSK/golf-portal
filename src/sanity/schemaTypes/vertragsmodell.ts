// vertragsmodell.ts
import { ValidationRule, SupportLevel, ZahlungsIntervall } from '@/types/sanity'

export default {
    name: 'vertragsmodell',
    title: 'Vertragsmodell',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required()
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
            name: 'preis',
            title: 'Preis',
            type: 'number'
        },
        {
            name: 'zahlungsintervall',
            title: 'Zahlungsintervall',
            type: 'string',
            options: {
                list: ['monatlich', 'jährlich']
            },
            validation: (Rule: ValidationRule) =>
                Rule.custom((interval: ZahlungsIntervall) => {
                    if (!['monatlich', 'jährlich'].includes(interval)) {
                        return 'Invalid interval'
                    }
                    return true
                })
        },
        {
            name: 'isTopPosition',
            title: 'TOP Position',
            type: 'boolean',
            description: 'Aktivieren für bevorzugte Positionierung',
            initialValue: false
        },
        {
            name: 'topPositionRank',
            title: 'TOP Position Rang',
            type: 'number',
            description: 'Wird automatisch basierend auf anderen TOP Positionen gesetzt',
            readOnly: true
        },
        {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{
                type: 'reference',
                to: [{type: 'feature'}]
            }],
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'supportLevel',
            title: 'Support Level',
            type: 'string',
            options: {
                list: [
                    {title: 'Basic Support', value: 'basic'},
                    {title: 'Premium Support', value: 'premium'},
                    {title: 'Premium Plus Support', value: 'premium_plus'}
                ]
            },
            validation: (Rule: ValidationRule) =>
                Rule.custom((level: SupportLevel) => {
                    if (!['basic', 'premium', 'premium_plus'].includes(level)) {
                        return 'Invalid support level'
                    }
                    return true
                })
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'preis'
        }
    }
}