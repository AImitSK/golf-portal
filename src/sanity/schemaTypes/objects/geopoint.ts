// sanity/schemaTypes/objects/geopoint.ts
import { defineType } from 'sanity'
import { GeopointInput } from '@/components/sanity/GeopointInput'

export default defineType({
    name: 'geopoint',
    title: 'Geopoint',
    type: 'object',
    components: {
        input: GeopointInput
    },
    fields: [
        {
            name: 'lat',
            type: 'number',
            title: 'Latitude'
        },
        {
            name: 'lng',
            type: 'number',
            title: 'Longitude'
        },
        {
            name: 'alt',
            type: 'number',
            title: 'Altitude',
            hidden: true
        }
    ]
})