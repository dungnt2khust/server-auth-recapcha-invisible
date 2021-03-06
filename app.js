const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
var cors = require("cors");
const app = express();
const port = 3002;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/subscribe", (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === "" ||
    req.body.captcha === null
  ) {
    return res.json({ success: false, msg: "Please select captcha" });
  }

  // Secret Key
  const secretKey = "6LdsrDAfAAAAADMSLNOxSaknsvx6AJFEQiv0W0F3";

  // Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make Request To VerifyURL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    console.log(body);

    // If Not Successful
    if (body.success !== undefined && !body.success) {
      return res.json({ success: false, msg: "Failed captcha verification" });
    }

    //If Successful
    return res.json({ success: true, msg: "Captcha passed" });
  });
});

// port is port of environment when deployed
app.listen(process.env.PORT || port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
