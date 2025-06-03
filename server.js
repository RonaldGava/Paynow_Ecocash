const express = require('express');
const { Paynow } = require('paynow');

const app = express();
const port = 3000;

// ✅ Cag Tours Pvt Ltd credentials
const paynow = new Paynow(
  '20625', // Integration ID
  'f6559511-ab13-45b0-b75b-07b36890f6a6' // Integration Key
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * 🌐 GET /paynow/initiate?phone=077xxxxxxx&amount=5
 */
app.get('/paynow/initiate', async (req, res) => {
  const phone = req.query.phone;
  const amount = parseFloat(req.query.amount || '0');

  if (!phone || !amount) {
    return res.status(400).send('⚠️ Please provide ?phone=077xxxxxxx&amount=5');
  }

  const payment = paynow.createPayment('INV-' + Date.now(), 'ronaldgava8@gmail.com');
  payment.add('Voiceflow EcoCash Payment', amount);

  try {
    const response = await paynow.sendMobile(payment, phone, 'ecocash');

    if (response.success) {
      console.log('✅ EcoCash Payment initiated for', phone);
      return res.status(200).json({
        message: 'EcoCash payment initiated. Please check your phone!',
        pollUrl: response.pollUrl
      });
    } else {
      console.log('❌ Payment failed:', response);
      return res.status(400).json({ error: response.error });
    }
  } catch (err) {
    console.error('💥 Server error:', err.message);
    return res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
