// src/sanity/schemaTypes/claimLog.ts
export default {
    name: 'claimLog',
    title: 'Claim Log',
    type: 'document',
    fields: [
        {
            name: 'club',
            title: 'Club',
            type: 'reference',
            to: [{ type: 'golfclub' }]
        },
        {
            name: 'admin',
            title: 'Administrator',
            type: 'reference',
            to: [{ type: 'administrator' }]
        },
        {
            name: 'claimedAt',
            title: 'Claimed At',
            type: 'datetime'
        },
        {
            name: 'ipAddress',
            title: 'IP Address',
            type: 'string'
        },
        {
            name: 'userAgent',
            title: 'User Agent',
            type: 'string'
        }
    ]
}