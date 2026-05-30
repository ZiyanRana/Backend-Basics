import nodemailer from 'nodemailer';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, EMAIL_USER, GOOGLE_REFRESH_TOKEN } from '../config/env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: EMAIL_USER,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN,
  },
});


transporter.verify((error) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } 
  else {
    console.log('Email server is ready to send messages');
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Authentication System" <${EMAIL_USER}>`, 
      to,
      subject,
      text,
      html
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};