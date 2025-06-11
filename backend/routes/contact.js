const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  console.log("📥 Contact route hit");

  const { name, email, message } = req.body;
  console.log("📝 Received Data:", { name, email, message });

  try {
    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    console.log("✅ Data saved to MongoDB");

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // You'll receive the mail here
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    console.log("⏳ Sending email...");
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");

    res.status(200).json({ message: 'Message sent successfully and email delivered' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
