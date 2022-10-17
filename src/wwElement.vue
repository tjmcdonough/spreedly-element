<template>
  <form id="payment-form"
    @submit="submitPaymentForm"
    method="POST"
    >
    <!-- novalidate="true" -->
    <input type="hidden"  name="payment_method_token" id="payment_method_token">

    <label for="full_name">Name</label>
    <input type="text" id="full_name" name="full_name"><br/>

    <label>Credit Card Number</label>
    <div id="spreedly-number" style="width:225px; height:35px; border: 2px solid"></div><br/>

    <label for="month">Expiration Date</label>
    <input type="text" id="month" name="month" maxlength="2">
    <input type="text" id="year" name="year" maxlength="4"><br/>

    <label>CVV</label>
    <div id="spreedly-cvv" style="width:60px; height:35px; border: 2px solid "></div><br/>

    <input id="submit-button" type="submit" value="Pay Now" disabled>

  </form>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
  },
  computed: {
    textStyle() {
      return {
        color: this.content.textColor,
      };
    },
  },
  mounted() {
    console.log('mounted');

    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://core.spreedly.com/iframe/iframe-v1.min.js')
    document.head.appendChild(recaptchaScript);

    document.onreadystatechange = () => {
    if (document.readyState == "complete") {
      console.log('Page completed with image and files!')
      Spreedly.init("2JUJq2v4HcgLwMJCiZvzDJuTxd", {
        "numberEl": "spreedly-number",
        "cvvEl": "spreedly-cvv"
      });

      Spreedly.on("ready", function () {
      
      var submitButton = document.getElementById('submit-button');
      submitButton.disabled = false;

      console.log('spreedly is ready');

      var creditCardField = document.getElementById('card_number');
      // creditCardField.disabled = false;
      creditCardField.value = '';

    
      Spreedly.on('errors', function(errors) {
        for (var i=0; i < errors.length; i++) {
          var error = errors[i];
          console.log(error);
        };
      });

      Spreedly.on('paymentMethod', function(token, pmData) {

        // Set the token in the hidden form field
        var tokenField = document.getElementById("payment_method_token");
        tokenField.setAttribute("value", token);

        // Submit the form
        var masterForm = document.getElementById('payment-form');
        masterForm.submit();
        });

      // Invoke Spreedly.recache() to recache CVV. On success,
      // the "recache" event will be triggered.
      Spreedly.on("recache", function(token, paymentMethod) {

        // Send ping back to server for post-recache transaction processing
        var masterForm = document.getElementById('payment-form');
        masterForm.submit();
      });
  
      Spreedly.setRecache("2JUJq2v4HcgLwMJCiZvzDJuTxd" , {
        'card_type': 'visa',
        'last_four_digits': '1234'
      });

        Spreedly.setParam('allow_blank_name', true);
        Spreedly.setParam('allow_expired_date', true);
        });
        }
      }
    },
    methods: {
      //Invoked Method
      submitPaymentForm(e) {

        debugger;
        //e.preventDefault(); 
        console.log('spreedly submiting payment form');

        var requiredFields = {};
        // Get required, non-sensitive, values from host page
        requiredFields["full_name"] = document.getElementById("full_name").value;
        requiredFields["month"] = document.getElementById("month").value;
        requiredFields["year"] = document.getElementById("year").value;
        Spreedly.tokenizeCreditCard(requiredFields);
        //return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-element {
  p {
    font-size: 18px;
  }
}
</style>
