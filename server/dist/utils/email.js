import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
let transporter = null;
function getTransporter() {
    if (!config.smtp.host || !config.smtp.user)
        return null;
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: false,
            auth: { user: config.smtp.user, pass: config.smtp.pass },
        });
    }
    return transporter;
}
export async function sendContactNotification(data) {
    const transport = getTransporter();
    if (!transport) {
        console.log('Email not configured. Contact message:', data);
        return;
    }
    await transport.sendMail({
        from: config.smtp.user,
        to: 'ymohan5000@gmail.com',
        subject: `New Contact: ${data.name} - ${data.service || 'General'}`,
        html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
      <p><strong>Service:</strong> ${data.service || 'General'}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
    });
}
