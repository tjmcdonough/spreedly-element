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
  data () {
    return {
      response: null,
      loading: true,
      errored: false,
      accessToken: this.getCookie('session')
    }
  },
  mounted() {
    console.log('mounted'); 

    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://core.spreedly.com/iframe/iframe-v1.min.js')
    document.head.appendChild(recaptchaScript);
    
    var accessToken = ''; //eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFmdkNWWUsxRGxKWkRkNzRtSTI3VSJ9.eyJpc3MiOiJodHRwczovL2FjbWVjb3JlLWRldi51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDk0NTYyNTIxOTAzMjE5MjU3MzIiLCJhdWQiOlsiaHR0cHM6Ly9kZXYuYWNtZWRhby5jb20vYXV0aCIsImh0dHBzOi8vYWNtZWNvcmUtZGV2LnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NjYxMDQ5MTYsImV4cCI6MTY2NjExMjExNiwiYXpwIjoib0pyaDBrd012Y1ExTDJuUXd5Yjh0b0F0OE95WmlWQ2QiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.w2iKme27UZJV69bIxrxl81ZoldwGe3m_Rd1RAQHZDafCJo9jTVsPtb8lCNQlC6Kq9-nkdQ4WP97or7jksf0a9R5Bjyc8xY4LAO72FtK0JrkvW9c_coVxQvCU9cEHH4sJAwoE83GsA3w27mg4TeNsbT0fTsYEJk7cJHCINl3Om7EqZIpOrpRqoXoqISj7F3ObWSqhHXjLFZsIrI5LhEIWZNRLdhuCLR5WTenLSUh5LcKcmd7OJ4ngaJiJcGEhF_2LWfjpGj9WAxI-nTVqNeBIU9k-86DxSsUBMXJz0Ns3jRSYfydeH6sTy3fex9hjOb-4lNxUuCvRfktd-yIXVcbA3A
    var cookies = document.cookie.split(';');
    
    for(var i=0 ; i < cookies.length ; ++i) {
        var pair = cookies[i].trim().split('=');
        if(pair[0] == 'session')
          accessToken = pair[1];
    }

    this.loginToAcmeBackend(accessToken);

    if (document.readyState == "complete") { 

      // Need two inits for when hot refresh happens
      Spreedly.init("2JUJq2v4HcgLwMJCiZvzDJuTxd", {
        "numberEl": "spreedly-number",
        "cvvEl": "spreedly-cvv"
      });
    }

    document.onreadystatechange = () => {
    if (document.readyState == "complete") { 

      // Need two inits for when hot refresh happens
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

        const addCard = {
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
          'Authorization': 'Bearer ' + accessToken
        };

        Axios
          .post(`${serverUrl}/user/addCard`, addCard, { headers })
          .then((response) => {
            console.log(response);
            this.response = response;
          })
          .catch((error) => {
            console.log(error)
            this.errored = true;
          })
          .finally(() => this.loading = false)
       

        // const createWyreCardTransaction = {
        //   token: token,
        //   number: payment_method.number,
        //   month: payment_method.month,
        //   year: payment_method.year,
        //   full_name: payment_method.full_name,
        //   card_type: payment_method.card_type,
        //   payment_method_type: payment_method.payment_method_type,
        //   created_at: payment_method.created_at,
        //   updated_at: payment_method.updated_at,
        //   destCurrency: 'ETH',
        //   priceInDestCurrency: '0.01',
        //   feesInDestCurrency: '0.0005',
        //   destWallet: '0x48C6F6b6828145E051aAf66dFaA3798450176473',
        //   tokenId: '77',
        //   contractId: '0x0'
        // };

        // Axios
        //   .post(`${serverUrl}/user/createWyreCardTransaction`, createWyreCardTransaction, { headers })
        //   .then((response) => {
        //     console.log(response);
        //     this.response = response;
        //   })
        //   .catch((error) => {
        //     console.log(error)
        //     this.errored = true;
        //   })
        //   .finally(() => this.loading = false)

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
      },
      getCookie(name) {
        
        var cookies = document.cookie.split(';');
        
        for(var i=0 ; i < cookies.length ; ++i) {
          var pair = cookies[i].trim().split('=');
          if(pair[0] == name)
          return pair[1];
        }
        return null;
      },
      loginToAcmeBackend(jwt) {

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + jwt
        };

        console.log(jwt);

        const serverUrl = 'https://dev.acmedao.com';

        return Axios
        .post(`${serverUrl}/user/login`, {}, { headers })
        .then((response) => {
          console.log("Successfully logged in " + JSON.stringify(response));
        })
        .catch((error) => {
          console.log("Failed to log in " + error)
        })
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
    font-family: 'Montserrat', sans-serif;
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
