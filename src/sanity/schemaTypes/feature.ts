// feature.ts
import { ValidationRule } from '@/types/sanity'

interface LimitParent {
    hat_limit?: boolean;
}

export default {
    name: 'feature',
    title: 'Feature',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required()
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
            name: 'limitierung',
            title: 'Limitierung',
            type: 'object',
            fields: [
                {
                    name: 'hat_limit',
                    title: 'Hat Limitierung',
                    type: 'boolean',
                    initialValue: false
                },
                {
                    name: 'limit_wert',
                    title: 'Limit-Wert',
                    type: 'number',
                    hidden: ({parent}: {parent: LimitParent}) => !parent?.hat_limit
                },
                {
                    name: 'limit_einheit',
                    title: 'Limit-Einheit',
                    type: 'string',
                    hidden: ({parent}: {parent: LimitParent}) => !parent?.hat_limit
                }
            ]
        }
    ]
}