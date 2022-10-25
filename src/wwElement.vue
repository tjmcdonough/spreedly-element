<template>
    <form id="payment-form" method="POST" novalidate="true" @submit="submitPaymentForm">
        <input id="payment_method_token" type="hidden" name="payment_method_token" />

        <input
            id="full_name"
            type="text"
            class="spreedly-input spreedly-top-input"
            name="full_name"
            style="min-width: 300px"
            placeholder="Name on the card"
        />

        <div id="spreedly-number" class="spreedly-input" placeholder="4242 4242 4242 4242"></div>

        <div style="display: flex">
            <input id="month" type="text" class="spreedly-input" name="month" maxlength="2" placeholder="MM" />
            <input id="year" type="text" class="spreedly-input" name="year" maxlength="4" placeholder="YYYY" /><br />
        </div>

        <div
            id="spreedly-cvv"
            class="spreedly-input spreedly-bottom-input"
            style="width: 100%; height: 48px; border: 1px solid #ebebf4"
            placeholder="CVV"
        ></div>
        <br />

        <input id="submit-button" type="submit" value="Continue" class="spreedly-pay-now" disabled />
    </form>
</template>

<script>
import axios from 'axios';

const serverUrl = 'https://dev.acmedao.com';
const accessToken = window.vm.config.globalProperties.$cookie.getCookie('session');
const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + accessToken,
    withCredentials: true,
};

async function loginToAcmeBackend() {
    try {
        await axios.post(`${serverUrl}/user/login`, {}, { headers });
        console.log('Successfully logged in with payment method');
    } catch (err) {
        console.log('Failed to log in ' + err);
    }
}

export default {
    props: {
        content: { type: Object, required: true },
    },
    data() {
        return {
            weWebId: 'bac36cd6-d0f5-4270-9ef9-ca3ddeb0ed76',
            response: null,
            loading: true,
            errored: false,
        };
    },
    async mounted() {
        const weWebId = this.weWebId;
        console.log('mounted', { weWebId });

        let recaptchaScript = document.createElement('script');
        recaptchaScript.setAttribute('src', 'https://core.spreedly.com/iframe/iframe-v1.min.js');
        document.head.appendChild(recaptchaScript);

        axios.defaults.withCredentials = true;

        function initialiseSpreedly() {
            console.log('trying spreedly init');
            if (window.Spreedly) {
                window.Spreedly.init('2JUJq2v4HcgLwMJCiZvzDJuTxd', {
                    numberEl: 'spreedly-number',
                    cvvEl: 'spreedly-cvv',
                });

                // Start of on ready
                window.Spreedly.on('ready', function () {
                    const submitButton = document.getElementById('submit-button');
                    submitButton.disabled = false;
                });
                // End of on ready

                // Start of on errors
                window.Spreedly.on('errors', function (errors) {
                    for (var i = 0; i < errors.length; i++) {
                        const error = errors[i];
                        console.error(error);
                    }
                });
                // End of on errors
                // Start of on payment method
                window.Spreedly.on('paymentMethod', async function (token, payment_method) {
                    console.log('on successful spreedly payment method');

                    const addCard = {
                        token: token,
                        number: payment_method.number,
                        month: payment_method.month,
                        year: payment_method.year,
                        full_name: payment_method.full_name,
                        card_type: payment_method.card_type,
                        payment_method_type: payment_method.payment_method_type,
                        created_at: payment_method.created_at,
                        updated_at: payment_method.updated_at,
                    };

                    try {
                        const response = await axios.post(`${serverUrl}/user/addCard`, addCard, { headers });
                        console.log('addCard success', response);
                        this.response = response;
                    } catch (err) {
                        console.error(err);
                        this.errored = true;
                    } finally {
                        this.loading = false;
                    }

                    const createWyreCardTransaction = {
                        token: token,
                        number: payment_method.number,
                        month: payment_method.month,
                        year: payment_method.year,
                        full_name: payment_method.full_name,
                        card_type: payment_method.card_type,
                        payment_method_type: payment_method.payment_method_type,
                        created_at: payment_method.created_at,
                        updated_at: payment_method.updated_at,
                        destCurrency: 'ETH',
                        priceInDestCurrency: '0.01', // TODO: Get value
                        feesInDestCurrency: '0.0005', // TODO: Get value
                        destWallet: '0x48C6F6b6828145E051aAf66dFaA3798450176473', // TODO: Get value
                        tokenId: '77', // TODO: Get value
                        contractId: '0x0', // TODO: Get value
                    };

                    try {
                        const response = await axios.post(
                            `${serverUrl}/user/createWyreCardTransaction`,
                            createWyreCardTransaction,
                            {
                                headers,
                            }
                        );
                        console.log('createWyreCardTransaction success', response);

                        wwLib.wwVariable.updateValue('var_payment_complete', true);
                    } catch (err) {
                        console.error(err);
                        this.errored = true;
                    } finally {
                        this.loading = false;
                    }
                });
                // End of on payment method
            } else {
                setTimeout(() => initialiseSpreedly(), 100);
            }
        }

        await loginToAcmeBackend();
        initialiseSpreedly();
    },
    methods: {
        //Invoked Method
        submitPaymentForm(e) {
            e.preventDefault();
            console.log('spreedly submiting payment form');

            var requiredFields = {};
            // Get required, non-sensitive, values from host page
            requiredFields['full_name'] = document.getElementById('full_name').value;
            requiredFields['month'] = document.getElementById('month').value;
            requiredFields['year'] = document.getElementById('year').value;

            window.Spreedly.tokenizeCreditCard(requiredFields);

            return false;
        },
    },
};
</script>

<style scoped>
.spreedly-input,
.input-outline-none {
    width: 100%;
    height: 48px;
    border: 1px solid #ebebf4;
    padding: 12px;
    font-weight: 500;
    color: #000;
    background-color: #fff;
    font-family: 'Montserrat', sans-serif;
}

.spreedly-input::placeholder,
.input-outline-none::placeholder {
    color: #cccccc;
}

.spreedly-top-input {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.spreedly-bottom-input {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.spreedly-pay-now {
    background-color: rgb(78, 113, 228);
    border: 3px solid rgb(78, 113, 228);
    color: #fff;
    font-size: 16px;
    border-radius: 8px;
    height: 48px;
    width: 100%;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
}

.spreedly-pay-now:hover {
    background-color: rgba(78, 113, 228, 80);
    border: 3px solid rgb(123, 149, 234);
}
</style>
