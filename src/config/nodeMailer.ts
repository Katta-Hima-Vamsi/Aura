import nodemailer from 'nodemailer';

/**
 * sendMail is an async function that sends an email using the nodemailer library.
 *
 * @param {string} emailSubject - The subject of the email
 * @param {string} message - The message body of the email
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the email is sent successfully,
 * or rejects with an error if the email could not be sent
 */
async function sendMail(emailSubject: string, message: string) {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.STATUS_EMAIL,
      pass: process.env.STATUS_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Aura Status Notifier <${process.env.STATUS_EMAIL}>`,
    to: process.env.API_MANAGER_EMAIL,
    subject: emailSubject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error(error);
  }
}

export default sendMail;
