<template>

    <form id="payment-form"
    @submit="submitPaymentForm"
    method="POST"
    novalidate="true">
  
    <input type="hidden" name="payment_method_token" id="payment_method_token">
    
    <input type="text" class="spreedly-input spreedly-top-input" id="full_name" name="full_name" style="min-width: 300px" placeholder="Name on the card">
  
    <div id="spreedly-number" class="spreedly-input"  placeholder="4242 4242 4242 4242"></div>
  
    <div style="display: flex">
      <input type="text" class="spreedly-input spreedly-month" id="month" name="month" maxlength="2" placeholder="MM">
      <input type="text" class="spreedly-input spreedly-year" id="year" name="year" maxlength="4" placeholder="YYYY"><br/>
    </div>
  
    <div id="spreedly-cvv" class="spreedly-input spreedly-bottom-input" placeholder="CVV"></div>
    
    <country-select 
    v-model="country" 
    :country="country" 
    topCountry="US" 
    :countryName="true" 
    class="spreedly-select" 
    aria-label="Select country"/>
  
    <input type="text" class="spreedly-input spreedly-top-input" id="zip_code" name="zip_code" placeholder="Zip Code" />
  
    <input type="text" class="spreedly-input spreedly-top-input" id="address" name="address" placeholder="Address" />
  
    <input type="text" class="spreedly-input spreedly-top-input" id="address2" name="address2" placeholder="Address 2" />
    
    <br />
    <br />
  
    <input id="submit-button" type="submit" value="Continue" class="spreedly-pay-now" disabled><br />
  
  </form>
  </template>
  
  <script>
  import axios from 'axios';
  import CountrySelect from './components/CountrySelect.vue';
  
  const serverUrl = 'https://dev.acmedao.com';
  const accessToken = window.vm.config.globalProperties.$cookie.getCookie('session');
  
  const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
      withCredentials: true,
  };
  
// Only needed for outside low code tool
//   async function loginToAcmeBackend() {
//       try {
//           await axios.post(`${serverUrl}/user/login`, {}, { headers });
//           console.log('Successfully logged in with payment method');
//       } catch (err) {
//           console.log('Failed to log in ' + err);
//       }
//   }
  
  export default {
      props: {
          content: { type: Object, required: true },
      },
      components: {
        CountrySelect
      },
      data() {
          let response = null;
          let loading = true;
          let errored = false;
          /* wwEditor:start */
          response = null;
          /* wwEditor:end */
          return {
              weWebId: 'bac36cd6-d0f5-4270-9ef9-ca3ddeb0ed76',
              response: null,
              loading: true,
              errored: false,
          };
      },
      async mounted() {
          console.log('mounted', { weWebId: this.weWebId });
  
          let recaptchaScript = document.createElement('script');
          recaptchaScript.setAttribute('src', 'https://core.spreedly.com/iframe/iframe-v1.min.js');
          document.head.appendChild(recaptchaScript);
  
          axios.defaults.withCredentials = true;
  
          const initialiseSpreedly = () => {
              console.log('trying spreedly init');
              if (window.Spreedly) {
                  window.Spreedly.init('2JUJq2v4HcgLwMJCiZvzDJuTxd', {
                      numberEl: 'spreedly-number',
                      cvvEl: 'spreedly-cvv',
                  });
  
                  // Start of on ready
                  window.Spreedly.on('ready', () => {
                      const submitButton = document.getElementById('submit-button');
                      submitButton.disabled = false;
                      Spreedly.setStyle("number", "width: 100%; height:44px; padding: 0px;");
                      Spreedly.setStyle("cvv", "width: 100%; height:44px; padding: 0px;");
                      Spreedly.setPlaceholder("number", "Card number");
                      Spreedly.setPlaceholder("cvv", "CVV");
                  });
                  // End of on ready
  
                  // Start of on errors
                  window.Spreedly.on('errors', errors => {
                      for (var i = 0; i < errors.length; i++) {
                          const error = errors[i];
                          console.error(error);
                      }
                  });
                  // End of on errors
                  // Start of on payment method
                  window.Spreedly.on('paymentMethod', (token, payment_method) => {
                      console.log('on successful spreedly payment method');
  
                      this.updatePaymentStatus('pending');
  
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
  
                      axios
                          .post(`${serverUrl}/user/addCard`, addCard, { headers })
                          .then(response => {
                            console.log('Added card to backend')
                            localStorage.payment_token = token;
                            localStorage.payment_method = JSON.stringify(payment_method);
                          })
                          .catch(error => {
                            this.updatePaymentStatus('failed');
                              console.log(error);
                          });
                      //.finally(() => this.loading = false)
                  });
                  // End of on payment method
              } else {
                  setTimeout(() => initialiseSpreedly(), 100);
              }
          };
  
          //await loginToAcmeBackend();
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
          updatePaymentStatus(val) {
            wwLib.wwVariable.updateValue(this.content.payment_status, val);
          },
          onSelect({name, iso2, dialCode}) {
            console.log(name, iso2, dialCode);
          }
      },
  };
  </script>
  
  
  
  <style scoped>
    .spreedly-input, 
    .input-outline-none,
    .spreedly-select {
      width:100%;
      height: 48px;
      border: 0px solid #ebebf4;
      padding: 0 12px;
      font-weight: 500;
      color: #000;
      background-color: #F7F7FD;
      font-family: 'Montserrat', sans-serif;
      margin: 4px 0px;
      border-radius: 12px;
    }

    .spreedly-select {
        color: #cccccc;
    }

    .spreedly-select option {
        color: #000;
    }
  
    .spreedly-month {
      margin-right: 4px;
    }
  
    .spreedly-year {
      margin-left: 4px;
    }
  
    .spreedly-input::placeholder, .input-outline-none::placeholder {
      color: #cccccc
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
  