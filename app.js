const express = require("express");
const bodyParser = require("body-parser");
const { Paynow } = require("./paynow");

const app = express();
const PORT = 3000;

// Replace with your Paynow details
const integrationId = "21035";
const integrationKey = "66703c08-699a-4810-a259-0ba6342362d3";

// These should be your live/publicly accessible endpoints in production
const resultUrl = " https://1cea-197-221-251-94.ngrok-free.app /paynow/result";
const returnUrl = " https://1cea-197-221-251-94.ngrok-free.app /thankyou";

const paynow = new Paynow(integrationId, integrationKey, resultUrl, returnUrl);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Paynow Integration Running");
});

app.post("/pay", async (req, res) => {
  const payment = paynow.createPayment("Order001", "customer@example.com");
  payment.add("Ecocash Product", 5); // Product name and amount

  try {
    const response = await paynow.sendMobile(payment, "0777123456", "ecocash");
    if (response.success) {
      res.redirect(response.redirectUrl); // Redirect user to Paynow
    } else {
      res.status(400).send("Payment failed: " + response.error);
    }
  } catch (err) {
    res.status(500).send("Error initiating payment");
  }
});

// Callback URL Paynow uses to notify you about payment status
app.post("/paynow/result", (req, res) => {
  console.log("Paynow Result Callback:", req.body);
  res.sendStatus(200); // Always send 200 to acknowledge receipt
});

// Page Paynow redirects user to after payment
app.get("/thankyou", (req, res) => {
  res.send("Thank you for your payment.");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
