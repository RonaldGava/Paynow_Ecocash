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

app.get('/paynow/initiate', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).send('⚠️ Phone number is required in ?phone=0771234567');
  }

  // 👇 Email is left empty or generic if required, adjust later if needed
  const payment = paynow.createPayment('INV-' + Date.now(), '');
  payment.add('Voiceflow EcoCash Payment', 5.00);

  try {
    const response = await paynow.sendMobile(payment, phone, 'ecocash');

    if (response.success) {
      console.log('✅ EcoCash Payment initiated for', phone);
      return res.status(200).json({
        message: 'EcoCash payment initiated. Check your phone!',
        pollUrl: response.pollUrl
      });
    } else {
      console.log('❌ Failed to initiate EcoCash:', response);
      return res.status(400).json({ error: response.error });
    }
  } catch (err) {
    console.error('💥 Error initiating payment:', err.message);
    return res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
