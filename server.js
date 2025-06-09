const express = require('express');
const { Paynow } = require('paynow');

const app = express();
const port = 3000;

// ✅ CAG Tours Pvt Ltd Paynow credentials
const paynow = new Paynow(
  '20625', // Integration ID
  'f6559511-ab13-45b0-b75b-07b36890f6a6' // Integration Key
);

// 🔐 Optional: set result & return URLs (can also be configured in the Paynow dashboard)
paynow.resultUrl = 'https://paynow-ecocash.onrender.com/paynow/result';
paynow.returnUrl = 'https://paynow-ecocash.onrender.com/paynow/return';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🟢 Route to initiate mobile payment (e.g., EcoCash)
app.get('/paynow/initiate', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).send('⚠️ Phone number required in ?phone=0771234567');
  }

  // ✅ Use merchant email (just for customer reference — not mandatory for matching)
  const payment = paynow.createPayment('INV-' + Date.now(), 'kunakamillicentrudo@gmail.com');
  payment.add('CAG EcoCash Payment', 5.00);

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

// Optional: result callback handler (POST)
app.post('/paynow/result', (req, res) => {
  console.log('📩 Paynow Result Callback:', req.body);
  res.status(200).send('Result received');
});

// Optional: return handler (GET)
app.get('/paynow/return', (req, res) => {
  res.send('✅ Payment process complete.');
});

app.listen(port, () => {
  console.log(`🚀 CAG Paynow Server running on port ${port}`);
});
