export default {
    name: 'account',
    title: 'Account',
    type: 'document',
    fields: [
        {
            name: 'userId',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'provider',
            type: 'string'
        },
        {
            name: 'providerAccountId',
            type: 'string'
        },
        {
            name: 'refreshToken',
            type: 'string'
        },
        {
            name: 'accessToken',
            type: 'string'
        },
        {
            name: 'expiresAt',
            type: 'number'
        },
        {
            name: 'tokenType',
            type: 'string'
        },
        {
            name: 'scope',
            type: 'string'
        },
        {
            name: 'idToken',
            type: 'string'
        },
        {
            name: 'user',
            type: 'reference',
            to: [{ type: 'administrator' }]
        }
    ]
}
