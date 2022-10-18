<template>
    <form id="payment-form"
    @submit="submitPaymentForm"
    method="POST"
    novalidate="true">
  
    <input type="hidden" name="payment_method_token" id="payment_method_token">
    
    <input type="text" class="spreedly-input spreedly-top-input" id="full_name" name="full_name" style="min-width: 300px" placeholder="Name on the card">
  
    <div id="spreedly-number" class="spreedly-input"  placeholder="4242 4242 4242 4242"></div>
  
    <div style="display: flex">
      <input type="text" class="spreedly-input" id="month" name="month" maxlength="2" placeholder="MM">
      <input type="text" class="spreedly-input" id="year" name="year" maxlength="4" placeholder="YYYY"><br/>
    </div>
  
    <div id="spreedly-cvv" class="spreedly-input spreedly-bottom-input" style="width:100%; height:48px; border: 1px solid #ebebf4" placeholder="CVV"></div><br/>
  
    <input id="submit-button" type="submit" value="Continue" class="spreedly-pay-now" disabled>
  
  </form>
 </template>
  
  <script>
  
  import Axios from 'axios';
  const serverUrl = 'https://dev.acmedao.com';
  
  export default {
    props: {
      content: {
        type: Object,
        required: true
      },
      accessToken: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        response: null,
        loading: true,
        errored: false,
        accessToken: window.vm === undefined ? '' : window.vm.config.globalProperties.$cookie.getCookie('session') ?? ''
      }
    },
    mounted() {
      console.log('mounted');
  
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://core.spreedly.com/iframe/iframe-v1.min.js')
      document.head.appendChild(recaptchaScript);
  
      document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        
        Spreedly.init("2JUJq2v4HcgLwMJCiZvzDJuTxd", {
          "numberEl": "spreedly-number",
          "cvvEl": "spreedly-cvv"
        });
  
        Spreedly.on("ready", function () {
  
          Spreedly.setParam('allow_blank_name', true);
          Spreedly.setParam('allow_expired_date', true);
        
          var submitButton = document.getElementById('submit-button');
          submitButton.disabled = false;
  
          console.log('spreedly is ready');
  
          var creditCardField = document.getElementById('card_number');
                
          Spreedly.on('errors', function(errors) {
            for (var i=0; i < errors.length; i++) {
              var error = errors[i];
              console.log(error);
            };
        });
  
        Spreedly.on('paymentMethod', function(token, payment_method) {
  
          const raw = {
            token: token,
            number: payment_method.number,
            month: payment_method.month,
            year: payment_method.year,
            full_name: payment_method.full_name,
            card_type: payment_method.card_type,
            payment_method_type: payment_method.payment_method_type,
            created_at: payment_method.created_at,
            updated_at: payment_method.updated_at
          };
  
          const headers = { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
          };
  
          Axios
          .post(`${serverUrl}/user/addCard`, raw, { headers })
          .then((response) => {
            console.log(response);
            this.response = response;
          })
          .catch((error) => {
            console.log(error)
            this.errored = true;
          })
          .finally(() => this.loading = false)
          });
  
        // Invoke Spreedly.recache() to recache CVV. On success,
        // the "recache" event will be triggered.
        // Spreedly.on("recache", function(token, paymentMethod) {
  
        //   // Send ping back to server for post-recache transaction processing
        //   var masterForm = document.getElementById('payment-form');
        //   masterForm.submit();
        // });
    
        // Spreedly.setRecache("2JUJq2v4HcgLwMJCiZvzDJuTxd" , {
        //   'card_type': 'visa',
        //   'last_four_digits': '1234'
        // });
  
         
          });
  
          }
        }
      },
      methods: {
        //Invoked Method
        submitPaymentForm(e) {
  
          e.preventDefault(); 
          console.log('spreedly submiting payment form');
  
          var requiredFields = {};
          // Get required, non-sensitive, values from host page
          requiredFields["full_name"] = document.getElementById("full_name").value;
          requiredFields["month"] = document.getElementById("month").value;
          requiredFields["year"] = document.getElementById("year").value;
  
          Spreedly.tokenizeCreditCard(requiredFields);
  
          return false;
      }
    }
  }
  
  </script>
  
  <style scoped>
    .spreedly-input, .input-outline-none {
      width:100%;
      height:48px;
      border: 1px solid #ebebf4;
      padding: 12px;
      font-weight: 500;
      color: #000;
      background-color: #fff;
    }
  
    .spreedly-input::placeholder, .input-outline-none::placeholder {
      color: #cccccc
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
      border: 3px solid rgb(8, 113, 228);
      color: #fff;
      font-size: 16px;
      border-radius: 8px;
      height: 48px;
      width: 100%;
      font-weight: 700;
    }
  
    .spreedly-pay-now:hover {
      background-color: rgba(78, 113, 228, 80);
      border: 3px solid rgb(123, 149, 234);
    }
  </style>
  