const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

// const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
// const PASSWORD = process.env.PASSWORD;

const EMAIL_USERNAME="firechat22@gmail.com";
const PASSWORD="dhduzvlvqmyofjhq ";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USERNAME,
      pass: PASSWORD
    },
    tls: {
      rejectUnauthorized: false
  }
  });
var mailConfigurations = {};

function setConfiguration(email, name, otp) {
  otp = " " + otp + " "
  mailConfigurations = {
    from: `Dictionary <${EMAIL_USERNAME}>`,
    to: email,
    subject: 'OTP for Dictionary Registration',
    html: `<div style="display: inline; font-size: 1.5rem">Welcome ${name}! Please Enter the OTP  ${otp}  for successfully registering in Dictionary.</div>`
};
}

function setConfigurationForReset(email, otp) {
  mailConfigurations = {
    from: `Dictionary <${EMAIL_USERNAME}>`,
    to: email,
    subject: 'OTP for Password Reset',
    // html: `<h2>Please Enter the OTP<p style="color: blue; text-align: center; font-size: 1.5rem">${otp}</p>to reset password</h2>.`
    html: `<div style="display: inline; font-size: 1.5rem"> Enter the OTP  ${otp} to reset password.</div>`
};
}

async function sendMail(res) {
  try {
transporter.sendMail(mailConfigurations, function(error, info){
  if (error)
    res.json({status: "error"});
  else
    res.json({status: "ok"});
});
  }
  catch(error) {
    res.json({status: "error"});
  }
}

async function sendMail1(name, res) {
  transporter.sendMail(mailConfigurations, function(error, info){
    if (error)
      res.json({status: "error"});
    else
      res.json({status: "ok", name: name});
  });
  }

module.exports = {
    setConfiguration: setConfiguration,
    setConfigurationForReset: setConfigurationForReset,
    sendMail: sendMail,
    sendMail1: sendMail1,
}
