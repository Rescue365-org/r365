// backend/server.js
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
app.use(cors());


const PAYPAL_CLIENT_ID = 'AZXuc-WAUcqticnxTPrMdIEtEVOAmqz2aotug7AnMY8BBheAGtBgYAXduXvovSWo8wEdLwgiJJceNSEZ';
const PAYPAL_SECRET = 'EI_FyBFNB-TE8QTmaQo2a7sDhIp53LTWEiM1MTkk5av4V7WnSu13W7NUDYCn2_mrHBVnO9hM3ej1SKhl';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // For sandbox

app.use(express.json());

// Endpoint to create a PayPal order
app.post('/create-paypal-order', async (req, res) => {
  try {
    // 1. Get access token
    const tokenResponse = await axios({
      url: `${PAYPAL_API}/v1/oauth2/token`,
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
      data: 'grant_type=client_credentials'
    });
    const accessToken = tokenResponse.data.access_token;

    // 2. Create order
    const orderResponse = await axios({
      url: `${PAYPAL_API}/v2/checkout/orders`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: '10.00',
          }
        }],
        application_context: {
          return_url: 'yourapp://donation-callback',
          cancel_url: 'yourapp://donation-callback'
        }
      }
    });

    // 3. Send approval link to client
    const approvalLink = orderResponse.data.links.find(link => link.rel === 'approve');
    return res.json({ approvalUrl: approvalLink.href });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// New endpoint to capture the PayPal order
app.post('/capture-paypal-order', async (req, res) => {
  try {
    const { orderID } = req.body; // This is the token/orderID from the callback

    // 1. Get a new access token
    const tokenResponse = await axios({
      url: `${PAYPAL_API}/v1/oauth2/token`,
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
      data: 'grant_type=client_credentials'
    });
    const accessToken = tokenResponse.data.access_token;

    // 2. Capture the order using the orderID
    const captureResponse = await axios({
      url: `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    res.json(captureResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});