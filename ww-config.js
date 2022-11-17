export default {
    editor: {
        label: {
            en: 'Spreedly',
        },
    },
    properties: {
        serverUrl: {
            label: {
                en: 'Server URL',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['String']
            }
        },
        accessToken: {
            label: {
                en: 'Access token',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['String']
            }
        },
        auth0_jwt: {
            label: {
                en: 'Auth0 JWT token',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['String']
            }
        },
        payment_status: {
            label: {
                en: 'Payment status - new, pending, complete, failed',
            },
            type: 'Variable',
            options: {
                types: ['String'],
            },
        },
        web3_walletId: {
            label: {
                en: 'Web3 Wallet Id',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['String']
            }
        },
        paymentToken: {
            label: {
                en: 'Spreedly token',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['String']
            }
        },
        cardType: {
            label: {
                en: 'Spreedly card type',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['String']
            }
        },
        lastFourDigits: {
            label: {
                en: 'Spreedly last 4 digits',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['String']
            }
        },
        isNewPayment: {
            label: {
                en: 'Is this a new payment?',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['Boolean']
            }
        },
        payment_response: {
            label: {
                en: 'Is this a new payment?',
            },
            type: 'Variable',
            bindable: true,
            options: {
                types: ['Boolean']
            }
        }
    }
};
