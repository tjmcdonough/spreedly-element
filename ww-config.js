export default {
  editor: {
    label: {
      en: "My Element",
    },
  },
  properties: {
    accessToken: {
      label: {
        en: "Access token",
      },
      type: "Text",
      bindable: true,
    },
    auth0_jwt: {
      label: {
        en: "Auth0 JWT token",
      },
      type: "Text",
      bindable: true
    },
    payment_complete: {
      label: {
        en: "Is payment complete?",
      },
      type: "Boolean",
      bindable: true
    }
  }, 
  variables: [
    { 
      name: 'var_payment_complete',
      value: false,
      type: 'Boolean',
      defaultValue: false,
      bindable: true
    }
  ]
};
