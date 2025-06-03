const express = require('express');
const { Paynow } = require('paynow');

const app = express();
const port = 3000;

// ✅ CAG Tours Pvt Ltd Paynow credentials
const paynow = new Paynow(
  '20625', // CAG Integration ID
  'f6559511-ab13-45b0-b75b-07b36890f6a6' // CAG Integration Key
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/paynow/initiate', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).send('⚠️ Phone number required in ?phone=0771234567');
  }

  // 📦 Payment setup
  const payment = paynow.createPayment('INV-' + Date.now(), 'ronaldgava8@gmail.com'); // Optional: Change to CAG Tours email
  payment.add('CAG EcoCash Payment', 5.00); // You can make amount dynamic if needed

  try {
    const response = await paynow.sendMobile(payment, phone, 'ecocash');

    if (response.success) {
      console.log('✅ EcoCash Payment initiated for', phone);
      return res.status(200).json({
        message: 'EcoCash payment initiated. Please check your phone!',
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
  console.log(`🚀 CAG Paynow Server running on port ${port}`);
});
