const nodemailer = require('nodemailer');
require("dotenv").config();
const MAILTRAP_USER = process.env.MAILTRAP_USER;
const MAILTRAP_PASS = process.env.MAILTRAP_PASS;
const MAILTRAP_PORT = process.env.MAILTRAP_PORT;
const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
const MY_EMAIL = process.env.MY_EMAIL;



const transporter = nodemailer.createTransport({
  host: MAILTRAP_HOST,
  port: MAILTRAP_PORT,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS
  }
});

async function sendNotificationEmail(notification) {
  await transporter.sendMail({
    from: `"Notification Service" <${MY_EMAIL}>`,
    to: notification.encadrantEmail,
    subject: "Nouveau stagiaire assigné",
    text: `Bonjour,\n\nLe stagiaire ${notification.stagiaireName} (${notification.stagiaireEmail}) vous a été assigné.`,
  });
}

module.exports = { sendNotificationEmail };
