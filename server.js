const express = require('express');
const { Paynow } = require('paynow');

const app = express();
const port = 3000;

const paynow = new Paynow(
  '21035', // Ronald Gava Integration ID
  '66703c08-699a-4810-a259-0ba6342362d3' // Ronald Gava Key
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/paynow/initiate', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).send('⚠️ Phone number required in ?phone=0771234567');
  }

  const payment = paynow.createPayment('INV-' + Date.now(), 'ronaldgava8@gmail.com');
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
