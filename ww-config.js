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
            type: 'Variable',
            bindable: true,
        },
        auth0_jwt: {
            label: {
                en: 'Auth0 JWT token',
            },
            type: 'Variable',
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
        web3_walletId: {
            label: {
                en: 'Web3 Wallet Id',
            },
            type: 'Variable',
            bindable: true,
        },
        tokenId: {
            label: {
                en: 'Token ID',
            },
            type: 'Variable',
            bindable: true,
        },
        contractId: {
            label: {
                en: 'Contract ID',
            },
            type: 'Variable',
            bindable: true,
        },
        destinationCurrency: {
            label: {
                en: 'Destination currency',
            },
            type: 'Variable',
            bindable: true,
        },
        priceInDestinationCurrency: {
            label: {
                en: 'Price in destination currency',
            },
            type: 'Variable',
            bindable: true,
        },
        feesInDestinationCurrency: {
            label: {
                en: 'Fees in destination currency',
            },
            type: 'Variable',
            bindable: true,
        }
    }
};
