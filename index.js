const express = require("express");
const { emailSender } = require("./emailSender");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(express.json());

// app.get("/", (req, res) => res.send("Hello World!"));
// app.use(cors())
const corsOptions = {
  origin: "https://my-portfolio-rosy-seven-45.vercel.app",
};

app.use(cors(corsOptions));

app.post("/contactme", async (req, res) => {
  try {
    const { name, email, website, description } = req.body;
    console.log("REQ => ", req.headers);
    if (!(name && email && description)) {
      return res
        .status(406)
        .json({ result: false, message: "All Data Required...!" });
    }

    // const isMailSended = await emailSender(name,email,website,description, req.ip);
    // console.log(isMailSended);

    const isMailSended = await emailSender(
      name,
      email,
      website,
      description,
      req.ip
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
