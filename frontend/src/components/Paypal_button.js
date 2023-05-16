import React, { useEffect } from 'react';

function PayPalButton() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.paypal.com/sdk/js?client-id=AdG6fV9p83IgtpqOzRFEG4IkVAmWLgRrEtXqIPlJb_WqOFxqj08BNd-4S5cd2jAiZKjSh13_s4AdONj1&currency=USD';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      // Render the PayPal button
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          // Call your server to set up the transaction
          return fetch('/demo/checkout/api/paypal/order/create/', {
            method: 'post'
          }).then(function(res) {
            return res.json();
          }).then(function(orderData) {
            return orderData.id;
          });
        },
        onApprove: function(data, actions) {
          // Call your server to finalize the transaction
          return fetch('/demo/checkout/api/paypal/order/' + data.orderID + '/capture/', {
            method: 'post'
          }).then(function(res) {
            return res.json();
          }).then(function(orderData) {
            // Handle the transaction result
            console.log(orderData);
          });
        }
      }).render('#paypal-button-container');
    };
    document.body.appendChild(script);
  }, []);

  return <div id="paypal-button-container"></div>;
}

export default PayPalButton;