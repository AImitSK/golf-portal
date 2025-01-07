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
            description: 'Aktivieren für bevorzugte Positionierung'
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
            of: [{type: 'reference', to: [{type: 'feature'}]}]
        },
        {
            name: 'supportLevel',
            title: 'Support Level',
            type: 'string',
            options: {
                list: ['basic', 'premium']
            },
            validation: (Rule: ValidationRule) =>
                Rule.custom((level: SupportLevel) => {
                    if (!['basic', 'premium'].includes(level)) {
                        return 'Invalid support level'
                    }
                    return true
                })
        }
    ]
}