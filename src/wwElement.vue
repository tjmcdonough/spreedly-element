<template>
  <div>
  
    <form id="payment-form"
    @submit.prevent="submitPaymentForm"
    method="POST"
    novalidate="true">
  
    <input 
    v-if="isNewPayment()"
    type="text" 
    class="spreedly-input spreedly-top-input" 
    id="full_name" 
    name="full_name" 
    placeholder="Name on the card">
  
    <div 
    v-if="isNewPayment()"
    type="number"
    id="spreedly-number"
    class="spreedly-input"
    placeholder="4242 4242 4242 4242"></div>
  
    <div
    v-if="isNewPayment()"
    style="display: flex">
      <input type="number" class="spreedly-input spreedly-month" id="month" name="month" maxlength="2" placeholder="MM">
      <input type="number" class="spreedly-input spreedly-year" id="year" name="year" maxlength="4" placeholder="YYYY"><br/>
    </div>
  
    <div id="spreedly-cvv" type="number" class="spreedly-input spreedly-bottom-input" placeholder="CVV"></div>
    
    <country-select
    v-if="isNewPayment()"
    v-model="country" 
    :country="country" 
    topCountry="US" 
    :countryName="true" 
    class="spreedly-select" 
    aria-label="Select country"/>
  
    <input v-if="isNewPayment()" type="text" class="spreedly-input spreedly-top-input" id="zip_code" name="zip_code" placeholder="Zip Code" />
  
    <input v-if="isNewPayment()" type="text" class="spreedly-input spreedly-top-input" id="address" name="address" placeholder="Address" />
  
    <input v-if="isNewPayment()" type="text" class="spreedly-input spreedly-top-input" id="address2" name="address2" placeholder="Address 2" />
    
    <br />
    <br />
  
    <input id="payment-form-button" type="submit" value="Continue" class="spreedly-pay-now" disabled><br />
  
   </form>

  </div>
</template>
    
    <script>
    import axios from 'axios';
    import CountrySelect from './components/CountrySelect.vue';
    axios.defaults.withCredentials = true;
  
    export default {
        props: {
            content: { type: Object, required: true }
        },
        components: {
          CountrySelect
        },
        data() {
          return {
            weWebId: 'bac36cd6-d0f5-4270-9ef9-ca3ddeb0ed76',
            response: null,
            loading: true,
            errored: false,
            //content: {
              //accessToken: '',
              //paymentToken: '',
              //cardType: '',
              //lastFourDigits: '',
              //payment_status: '',
              //isNewPayment: true,
              //serverUrl: 'https://dev.acmedao.com'
            //}
          };
        },
        unmounted() {
          window.Spreedly = undefined
        },
        mounted() {

          this.logVariables()
  
          const headers = {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.content.accessToken,
              withCredentials: true,
            };
          
          this.loginToAcmeBackend(headers);
          
          let recaptchaScript = document.createElement('script');
          recaptchaScript.setAttribute('src', 'https://core.spreedly.com/iframe/iframe-v1.min.js');
          document.head.appendChild(recaptchaScript);
  
          const initialiseSpreedly = () => {
              console.log('Spreedly: initialising');
              
              if (window.Spreedly) {
                  Spreedly.init('2JUJq2v4HcgLwMJCiZvzDJuTxd', {
                      numberEl: 'spreedly-number',
                      cvvEl: 'spreedly-cvv',
                  });
  
                  // Start of on ready
                  Spreedly.on('ready', () => {
  
                    if(this.content.paymentToken)
                    {
                      Spreedly.setRecache(this.content.paymentToken, {
                        'card_type': this.content.cardType,
                        'last_four_digits': this.content.lastFourDigits
                      });
                    }
  
                      const submitButton = document.getElementById('payment-form-button');
                      submitButton.disabled = false;
                      Spreedly.setStyle("number", "width: 100%; height:44px; padding: 0px;");
                      Spreedly.setStyle("cvv", "width: 100%; height:44px; padding: 0px;");
                      Spreedly.setPlaceholder("number", "Card number");
                      Spreedly.setPlaceholder("cvv", "CVV");
                  });
                  // End of on ready
  
                  // Start of on errors
                  Spreedly.on('errors', errors => {
                      for (var i = 0; i < errors.length; i++) {
                          const error = errors[i];
                          console.error(error);
                      }
                  });
                  // End of on errors
                  // Start of on payment method
                  Spreedly.on('paymentMethod', (token, payment_method) => {
                      console.log('Spreedly: on successful payment method');
  
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
                          .post(`${this.content.serverUrl}/user/addCard`, addCard, { headers })
                          .then(response => {
                            console.log('Spreedly: Added card to backend')

                            this.updatePaymentResponse(token, payment_method)

                            // localStorage.payment_token = token;
                            // localStorage.payment_method = JSON.stringify(payment_method);
                          })
                          .catch(error => {
                              console.log('Spreedly: ' + error);
                          });
               
                  });
                  // End of on payment method
              } else {
                  setTimeout(() => initialiseSpreedly(), 2500);
              }
            };
    
            initialiseSpreedly();

        },
        methods: {
          logVariables() {
            console.log('Spreedly: Logging access token: ' + this.content.accessToken);
          },
          //Invoked Method
          submitPaymentForm(e) {
              //e.preventDefault();
              console.log('Spreedly: submiting payment form');
  
              var requiredFields = {};
              // Get required, non-sensitive, values from host page
              requiredFields['full_name'] = document.getElementById('full_name').value;
              requiredFields['month'] = document.getElementById('month').value;
              requiredFields['year'] = document.getElementById('year').value;
  
              Spreedly.tokenizeCreditCard(requiredFields);
  
              return false;
          },
          updatePaymentStatus(val) {
            wwLib.wwVariable.updateValue(this.content.payment_status, val);
          },
          updatePaymentResponse(payment_token, payment_method) {

            var val = {
              payment_token,
              payment_method
            }
            
            console.log('Spreedly: Updating payment response');

            wwLib.wwVariable.updateValue(this.content.payment_response, val);
          },
          isNewPayment() {
            return this.content.isNewPayment
          },
          loginToAcmeBackend(headers) {
  
            try {
                axios.post(`${this.content.serverUrl}/user/login`, {}, { headers });
                console.log('Spreedly: Successfully logged in');
            } catch (err) {
                console.log('Spreedly: Failed to log in ' + err);
            }
  
          }
        }
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
        background-color: #F7F7FD;
        font-family: 'Montserrat', sans-serif;
        margin: 4px 0px;
        border-radius: 12px;
        color: #000;
      }
  
      .spreedly-input, 
      .input-outline-none {
          color: #000;
      }
  
      .spreedly-select option {
          color: #000 !important;
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
    