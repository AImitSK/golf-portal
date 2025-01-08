export default {
    name: 'session',
    title: 'Session',
    type: 'document',
    fields: [
        {
            name: 'sessionToken',
            type: 'string'
        },
        {
            name: 'userId',
            type: 'string'
        },
        {
            name: 'expires',
            type: 'datetime'
        },
        {
            name: 'user',
            type: 'reference',
            to: [{ type: 'administrator' }]
        }
    ],
    hidden: true
}
