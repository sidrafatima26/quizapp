const nodemailer = require('nodemailer');
 
// Function to send an email using Nodemailer
const sendMail = async (email, subject, message) => {
  try {
    // Create a transporter object using Gmail SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: 'sajidkholood@gmail.com', // Your Gmail address
        pass: 'spkb wiqc ilfd oxbb' // Your Gmail App Password
      }
    });
 
    // Define the email message options
    let mailOptions = {
      from: 'sajidkholood@gmail.com', // Sender address
      to: email, // List of receivers
      subject: subject, // Subject line
      text: message, // Plain text body
      // html: '<b>Hello world?</b>' // HTML body (optional)
    };
 
    // Send the email
    let info = await transporter.sendMail(mailOptions);
 
    console.log('Message sent: %s', info.messageId);
    return 'Email sent successfully';
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
 
module.exports = sendMail;