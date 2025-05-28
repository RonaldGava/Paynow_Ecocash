const express = require('express');
const { Paynow } = require('paynow');

const app = express();
const port = 3000;

// Your real Paynow credentials here
const paynow = new Paynow(
  '21035',                                // Integration ID
  '66703c08-699a-4810-a259-0ba6342362d3' // Integration Key
);

// ✅ Add these two lines to fix the ResultUrl error
paynow.resultUrl = 'https://1cea-197-221-251-94.ngrok-free.app/paynow/result';
paynow.returnUrl = 'https://1cea-197-221-251-94.ngrok-free.app/paynow/return';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/paynow/initiate', async (req, res) => {
  try {
    // Create payment with unique reference and email
    const payment = paynow.createPayment('INV123456', 'ronaldgava8@gmail.com');

    // Add an item with description, amount and quantity
    payment.add('Test Item', 10.00);

    // Send payment request to Paynow
    const response = await paynow.send(payment);

    if (response.success) {
      console.log('✅ Redirect user to:', response.redirectUrl);
      return res.redirect(response.redirectUrl);
    } else {
      console.log('❌ Payment initiation failed:', response);
      return res.status(400).send('Payment initiation failed.');
    }
  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/paynow/result', (req, res) => {
  console.log('✅ Received Paynow result callback');
  console.log('📦 Body:', req.body);
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
