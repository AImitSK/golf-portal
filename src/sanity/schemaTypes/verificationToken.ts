export default {
    name: 'verificationToken',
    title: 'Verification Token',
    type: 'document',
    fields: [
        {
            name: 'identifier',
            type: 'string'
        },
        {
            name: 'token',
            type: 'string'
        },
        {
            name: 'expires',
            type: 'datetime'
        }
    ]
}
