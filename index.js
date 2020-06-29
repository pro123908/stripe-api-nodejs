const express = require("express");
const { stripePublishKey, stripeSecretKey } = require("./config/keys");
const stripe = require("stripe")(stripeSecretKey);
const bodyParser = require("body-parser");
const expressHandleBars = require("express-handlebars");

const app = express();

// using handlebars template engine, defining main named file to be the engine file
app.engine("handlebars", expressHandleBars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set static folder
app.use(express.static(`${__dirname}/public`));

// index route
app.get("/", (req, res) => {
  res.render("index", {
    stripePublishKey,
  });
});

app.post("/charge", async (req, res) => {
  const amount = 2500;

  const { stripeEmail, stripeToken } = req.body;

  const customer = await stripe.customers.create({
    email: stripeEmail,
    source: stripeToken,
  });

  const charge = await stripe.charges.create({
    amount,
    description: "Web Development Ebook",
    currency: "usd",
    customer: customer.id,
  });

  res.render("success");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on the port ${PORT}`));
