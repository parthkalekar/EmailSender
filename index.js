const express = require("express");
const { emailSender , mailSender } = require("./emailSender");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(express.json());

// app.get("/", (req, res) => res.send("Hello World!"));
// app.use(cors())
// const corsOptions = {
//   origin: "https://my-portfolio-rosy-seven-45.vercel.app",
// };
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",") 

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Important to allow sending cookies
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"], // Include Cookie header to allow cookie exchange
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));

app.post("/contactme", async (req, res) => {
  try {
    const { name, email, website, description } = req.body;
    // console.log("REQ => ", req.headers);
    if (!(name && email && description)) {
      return res
        .status(406)
        .json({ result: false, message: "All Data Required...!" });
    }

    // const isMailSended = await emailSender(name,email,website,description, req.ip);
    // console.log(isMailSended);
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress
    const isMailSended = await emailSender(
      name,
      email,
      website,
      description,
      ip
    );
    if (!isMailSended) {
      return res
        .status(400)
        .json({ result: false, message: "Something went Wrong" });
    }
    res
      .status(200)
      .json({ result: true, message: "Message Registered Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        result: true,
        message: "Internal Server Error...!",
        error: error.message,
      });
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const myTemplate = `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact Form Submission</title>
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', sans-serif;
      background-color: #000;
      color: #fff;
    }

    .wrapper {
      background: linear-gradient(145deg, #111, #000);
      padding: 40px 20px;
    }

    .card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border: 2px solid #ff6a00;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 8px 30px rgba(255, 106, 0, 0.2);
      animation: fadeIn 1s ease forwards;
    }

    h2 {
      text-align: center;
      color: #ff6a00;
      font-size: 24px;
      margin-bottom: 30px;
    }

    .field {
      margin-bottom: 20px;
      animation: fadeIn 0.8s ease forwards;
    }

    .label {
      color: #ffbb66;
      font-weight: 600;
      margin-bottom: 5px;
      font-size: 14px;
      text-transform: uppercase;
    }

    .value {
      background-color: #262626;
      padding: 12px;
      border-radius: 10px;
      color: #fff;
      font-size: 15px;
      line-height: 1.5;
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      text-align: center;
      color: #777;
    }

    @media (max-width: 640px) {
      .card {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <h2>🚀 New Contact Submission</h2>

      <div class="field">
        <div class="label">Name</div>
        <div class="value">${name || "Anonymous"}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value">${email || "Anonymous"}</div>
      </div>

      <div class="field">
        <div class="label">Message</div>
        <div class="value">${message || "Anonymous"} </div>
      </div>

      <div class="field">
        <div class="label">IP Address</div>
        <div class="value">${req.ip || "Anonymous"}</div>
      </div>

      <div class="footer">
        This email was generated from your portfolio's contact form.
      </div>
    </div>
  </div>
</body>
</html>`;

    const replyTemplate = `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Thanks for Reaching Out</title>
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', sans-serif;
      background-color: #000;
      color: #fff;
    }

    .wrapper {
      background: linear-gradient(145deg, #111, #000);
      padding: 40px 20px;
    }

    .card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border: 2px solid #ff6a00;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 8px 30px rgba(255, 106, 0, 0.2);
      animation: fadeIn 1s ease forwards;
    }

    h2 {
      text-align: center;
      color: #ff6a00;
      font-size: 24px;
      margin-bottom: 20px;
    }

    p {
      font-size: 15px;
      color: #ccc;
      line-height: 1.7;
      animation: fadeIn 0.8s ease forwards;
    }

    .highlight {
      color: #ffbb66;
      font-weight: 600;
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      text-align: center;
      color: #777;
    }

    @media (max-width: 640px) {
      .card {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <h2>👋 Thanks for Reaching Out, Parth Kalekar!</h2>

      <p>
        I’ve received your message and will get back to you as soon as possible.
        If your message requires urgent attention, feel free to reply to this email.
      </p>

      <p>
        Here's what you sent:
      </p>

      <p class="highlight">"${message || "N/A"}"</p>

      <p>
        I appreciate you taking the time to connect.<br />
        — <strong>Parth Kalekar</strong>
      </p>

      <div class="footer">
        This message was sent from my portfolio contact form.<br />
        You don't need to reply unless you'd like to follow up.
      </div>
    </div>
  </div>
</body>
                            </html>`;

    const isMailSend = await mailSender("Parth Kalekar", process.env.MY_EMAIL, "Contact Message", myTemplate);
    const isReplySend = await mailSender("Parth Kalekar",email, "Thanks for Reaching Out", replyTemplate);

    if (isMailSend && isReplySend) {
      return res.status(200).send("Message Sent Successfully");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }

})

// app.get('/h', (req,res) => {
//   return res.status(200).send("Hello World !");
// })
// app.get('/hh', (req,res) => {
//   return res.status(200).send("Hello World 12232424 !");
// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
