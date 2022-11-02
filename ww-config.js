export default {
    editor: {
        label: {
            en: 'Spreedly',
        },
    },
    properties: {
        accessToken: {
            label: {
                en: 'Access token',
            },
            type: 'Text',
            bindable: true,
        },
        auth0_jwt: {
            label: {
                en: 'Auth0 JWT token',
            },
            type: 'Text',
            bindable: true,
        },
        payment_complete: {
            label: {
                en: 'Is payment complete?',
            },
            type: 'Variable',
            options: {
                types: ['Boolean'],
            },
        },
        payment_processing: {
            label: {
                en: 'Is payment processing?',
            },
            type: 'Variable',
            options: {
                types: ['Boolean'],
            },
        },
    },
    variables: [
        {
            name: 'var_payment_complete',
            type: 'Boolean',
            defaultValue: false,
            bindable: true,
        }
    ],
};
