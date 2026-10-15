const express = require('express');
const path = require('node:path');
const { existsSync } = require('node:fs');
const { randomUUID } = require('node:crypto');
const nodemailer = require('nodemailer');

// Node.js reads secrets from a local .env file; it is never served to visitors.
const envFile = path.join(__dirname, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const app = express();
const mailConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO);
const transporter = mailConfigured ? nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS.replace(/\s/g, '') },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000
}) : null;

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contact', async (req, res, next) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ message: 'Please submit a JSON object.' });
  }
  const fields = ['name', 'email', 'message'];
  if (fields.some(field => typeof body[field] !== 'string')) {
    return res.status(400).json({ message: 'Name, email and message must be text.' });
  }
  const name = body.name.trim();
  const email = body.email.trim();
  const message = body.message.trim();
  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ message: 'Enter a name between 2 and 100 characters.' });
  }
  if (email.length > 254 || /[\r\n]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (message.length < 10 || message.length > 2000) {
    return res.status(400).json({ message: 'Enter a message between 10 and 2000 characters.' });
  }
  const contact = { id: randomUUID(), name, email, message, createdAt: new Date().toISOString() };
  if (!transporter) {
    return res.status(503).json({ message: 'The contact form email service is not configured yet. Please use the email link above.' });
  }
  try {
    const result = await transporter.sendMail({
      from: { name: 'Portfolio Contact Form', address: process.env.SMTP_USER },
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: 'New message from your portfolio',
      text: `Name: ${name}\nEmail: ${email}\nDate: ${contact.createdAt}\nReference: ${contact.id}\n\n${message}`
    });
    if (!result.accepted || result.accepted.length === 0 || result.rejected?.length) {
      throw new Error('The mail server did not accept the recipient.');
    }
    res.status(200).json({ message: 'Thank you! Your message has been sent.', id: contact.id });
  } catch (error) {
    next(error);
  }
});

app.use('/api', (req, res) => res.status(404).json({ message: 'API endpoint not found.' }));

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON request.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Your submission is too large.' });
  }
  console.error('Contact request failed:', error.message);
  res.status(500).json({ message: 'Unable to send your message. Please try again later or use the email link above.' });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  if (!mailConfigured) console.warn('Add SMTP_USER, SMTP_PASS and CONTACT_TO to .env to enable email.');
  app.listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
}

module.exports = app;
