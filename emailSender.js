require("dotenv").config();
const nodemailer = require("nodemailer");

const emailSender = async (name, email, website, description, ipaddress) => {
  const transporter = await nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  const newMessage = `
    Name  :  ${name} \n
    Email :  ${email}\n
    Website :  ${website}\n
    Description : ${description}\n
    Date: ${new Date().toUTCString()}\n
    IP: ${ipaddress}\n
    `;

  const details = {
    from: "VERCEL PORTFOLIO",
    to: process.env.TO_EMAIL,
    subject: "PORFOLIO CONTACT",
    text: `${newMessage}`,
  };

  try {
    const checkMailSend = await transporter.sendMail(details);
    if (checkMailSend) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
const mailSender = async (from, toEmail, subject, template) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
      },
    });

    let details = {
      from: `${from}`,
      to: `${toEmail}`,
      subject: `${subject}`,
      // text: `${message}`,
      html: template,
    };

    const isSended = await transporter.sendMail(details);
    return isSended
  } catch (error) {
    return false;
  }
};
module.exports = { emailSender, mailSender};
