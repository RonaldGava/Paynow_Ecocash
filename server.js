const express = require('express');
const { Paynow } = require('paynow');

const app = express();
const port = 3000;

// ✅ Ronald Gava - Ecocash Payment Integration Credentials
const paynow = new Paynow(
  '21035', // Integration ID
  '66703c08-699a-4810-a259-0ba6342362d3' // Integration Key
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * 🌐 Trigger EcoCash popup to user phone
 * URL format: GET /paynow/initiate?phone=0771234567
 */
app.get('/paynow/initiate', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).send('⚠️ Phone number required in ?phone=0771234567');
  }

  const reference = 'RONALD-' + Date.now();
  const email = 'ronaldgava8@gmail.com'; // Replace if Paynow account email is different

  const payment = paynow.createPayment(reference, email);
  payment.add('Ecocash Payment from Voiceflow', 5.00); // You can make this dynamic if needed

  try {
    const response = await paynow.sendMobile(payment, phone, 'ecocash');

    if (response.success) {
      console.log('✅ EcoCash Payment initiated for', phone);
      return res.status(200).json({
        message: 'EcoCash payment initiated. Please check your phone!',
        pollUrl: response.pollUrl,
        reference: reference
      });
    } else {
      console.log('❌ EcoCash initiation failed:', response);
      return res.status(400).json({ error: response.error });
    }
  } catch (err) {
    console.error('💥 Error initiating payment:', err.message);
    return res.status(500).send('Server error');
  }
});

/**
 * 📦 Paynow will POST payment status updates here
 */
app.post('/paynow/result', (req, res) => {
  console.log('✅ Received Paynow result callback');
  console.log('📦 Body:', req.body);
  res.status(200).send('OK');
});

/**
 * 🧪 For testing return URL (if used)
 */
app.get('/paynow/return', (req, res) => {
  res.send('🎉 You were redirected back after a payment.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
