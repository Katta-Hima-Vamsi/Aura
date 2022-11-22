// Import node mailer
import nodeMailer from 'nodemailer';

// Create a send mail function
function sendMail(emailSubject: string, message: string) {
  // Create a transporter
  const transporter = nodeMailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.STATUS_EMAIL,
      pass: process.env.STATUS_EMAIL_PASSWORD,
    },
  });

  // Define the mail options
  const mailOptions = {
    from: `Aura Status Notifier <${process.env.STATUS_EMAIL}>`,
    to: process.env.API_MANAGER_EMAIL,
    subject: emailSubject,
    text: message,
  };

  // Send the mail
  transporter.sendMail(mailOptions, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent successfully');
    }
  });
}

// Export the send mail function
export default sendMail;
