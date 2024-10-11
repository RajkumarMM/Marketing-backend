import express from 'express';
import nodemailer from 'nodemailer'; // Import nodemailer
import QueryModel from '../model/QueryModel.js'; // Import the QueryModel

const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail as the email service (you can use others)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email account password (or an app password for Gmail)
  },
});

// Route to handle form submission
router.post('/submit-query', async (req, res) => {
  const { name, email, phone, subject, query } = req.body;

  // Validate required fields
  if (!name || !email || !query) {
    return res.status(400).json({ message: 'Name, email, and query are required.' });
  }

  // Create a new query instance and save it to MongoDB
  const newQuery = new QueryModel({ name, email, phone, subject, query });

  try {
    await newQuery.save(); // Wait for the save operation to complete

    // Email to the Admin
    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER, // Your email address
      to: 'mmraj816@gmail.com', // Your email to receive notifications
      subject: `New Query from ${name}`, // Subject line
      text: `You have received a new query from the website:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${query}`, // Body of the email
    };

    // Confirmation Email to the User
    const mailOptionsUser = {
      from: process.env.EMAIL_USER, // Your email address
      to: email, // The user's email address
      subject: `Thank you for contacting us, ${name}!`, // Subject line for the user
      text: `Dear ${name},\n\nThank you for reaching out to us. We have received your query and will respond soon.\n\nHere is a copy of your message:\n\n"${query}"\n\nBest regards,\nYour Company Team`, // Body of the email
    };

    // Send the email to the admin
    transporter.sendMail(mailOptionsAdmin, (error, info) => {
      if (error) {
        console.error('Error sending email to admin:', error);
      } else {
        console.log('Admin email sent: ' + info.response);
      }
    });

    // Send the confirmation email to the user
    transporter.sendMail(mailOptionsUser, (error, info) => {
      if (error) {
        console.error('Error sending confirmation email to user:', error);
      } else {
        console.log('User confirmation email sent: ' + info.response);
      }
    });

    // Send success response to the frontend
    res.status(200).json({ message: 'Query submitted and emails sent successfully!' });
  } catch (err) {
    console.error('Error saving query:', err); // Log the error for debugging
    res.status(500).json({ message: 'Error submitting query' });
  }
});

export default router; // Export the router
