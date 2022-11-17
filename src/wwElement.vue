<template>
  <div>
  <!-- Remember to comment out the form  -->
  
    <!-- <form id="payment-form"
    @submit.prevent="submitPaymentForm"
    method="POST"
    novalidate="true"> -->
  
    <input 
    v-if="isNewPayment"
    type="text" 
    class="spreedly-input spreedly-top-input" 
    id="full_name" 
    name="full_name" 
    placeholder="Name on the card">
  
    <div 
    v-if="isNewPayment"
    type="number"
    id="spreedly-number"
    class="spreedly-input"
    placeholder="4242 4242 4242 4242"></div>
  
    <div
    v-if="isNewPayment"
    style="display: flex">
      <input type="number" class="spreedly-input spreedly-month" id="month" name="month" maxlength="2" placeholder="MM">
      <input type="number" class="spreedly-input spreedly-year" id="year" name="year" maxlength="4" placeholder="YYYY"><br/>
    </div>
  
    <div id="spreedly-cvv" type="number" class="spreedly-input spreedly-bottom-input" placeholder="CVV"></div>
    
    <country-select
    v-if="isNewPayment"
    v-model="country" 
    :country="country" 
    topCountry="US" 
    :countryName="true" 
    class="spreedly-select" 
    aria-label="Select country"/>
  
    <input v-if="isNewPayment" type="text" class="spreedly-input spreedly-top-input" id="zip_code" name="zip_code" placeholder="Zip Code" />
  
    <input v-if="isNewPayment" type="text" class="spreedly-input spreedly-top-input" id="address" name="address" placeholder="Address" />
  
    <input v-if="isNewPayment" type="text" class="spreedly-input spreedly-top-input" id="address2" name="address2" placeholder="Address 2" />
    
    <br />
    <br />
  
    <!-- <input id="payment-form-button" type="submit" value="Continue" class="spreedly-pay-now" disabled><br />
  
   </form> -->

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
            content: {
              accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFmdkNWWUsxRGxKWkRkNzRtSTI3VSJ9.eyJpc3MiOiJodHRwczovL2FjbWVjb3JlLWRldi51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDk0NTYyNTIxOTAzMjE5MjU3MzIiLCJhdWQiOiJvSnJoMGt3TXZjUTFMMm5Rd3liOHRvQXQ4T3laaVZDZCIsImlhdCI6MTY2ODY3NzgyNywiZXhwIjoxNjY4NzEzODI3LCJzaWQiOiJUQ3dpdnNTcno5ck53UE8yUzhMdGdYT1pGMVI0dy0xSSIsIm5vbmNlIjoiTXVWcy13ZVNmUU9zeFVYZUJLdWUwenZWNWdpQnBTOW8ifQ.ygRf7NVPx8odyMpevCelKTKmPL5tMQUcu-gR3JLk_2ERhoS0vI9bGYlrRQYq5VuPaouPdbzlZgtTyQClaCbLKxtJ6CW_PuLqZaOASrYwYEUeM3Beqnog8L9zchzv4DB8HMEkDix_DG3rfPpnq8O7BewZPf6l4iHUEYQA7vh1_bj8fK-uLoWS-yoBACV82ZdgUcJHFUbWMIxwk-qzMcwgk6epQWhqP0pV9VqSTJvR_m7dD8VylNS4uVzpZ4UFS3ygMZOX69FNCG5wmskzM0046Ks9dnVnAD87dNj86GRgKNKETHFSPvIE5VC61jmHl1Q1pjC7LNE360zhmpRVnLnV1Q',
              paymentToken: '',
              cardType: '',
              lastFourDigits: '',
              payment_status: 'existing',
              serverUrl: 'https://dev.acmedao.com',
              isNewPayment: true
            }
          };
        },
        async mounted() {
  
          const headers = {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.content.accessToken,
              withCredentials: true,
            };
          
          await this.loginToAcmeBackend(headers);
          
          console.log('mounted', { weWebId: this.weWebId });
          
          let recaptchaScript = document.createElement('script');
          recaptchaScript.setAttribute('src', 'https://core.spreedly.com/iframe/iframe-v1.min.js');
          document.head.appendChild(recaptchaScript);
  
          const initialiseSpreedly = () => {
              console.log('trying spreedly init');
              if (window.Spreedly) {
                  window.Spreedly.init('2JUJq2v4HcgLwMJCiZvzDJuTxd', {
                      numberEl: 'spreedly-number',
                      cvvEl: 'spreedly-cvv',
                  });
  
                  // Start of on ready
                  window.Spreedly.on('ready', () => {
  
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
                          .post(`${this.content.serverUrl}/user/addCard`, addCard, { headers })
                          .then(response => {
                            console.log('Added card to backend')
                            localStorage.payment_token = token;
                            localStorage.payment_method = JSON.stringify(payment_method);
                          })
                          .catch(error => {
                              console.log(error);
                          });
               
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
              //e.preventDefault();
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
          },
          isNewPayment() {
              return this.content.isNewPayment
          },
          async loginToAcmeBackend(headers) {
  
            try {
                await axios.post(`${this.content.serverUrl}/user/login`, {}, { headers });
                console.log('Successfully logged in with payment method');
            } catch (err) {
                console.log('Failed to log in ' + err);
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
      }
  
      .spreedly-input, 
      .input-outline-none {
          color: #000;
      }
  
      .spreedly-select {
          color: #cccccc;
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
    