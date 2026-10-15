# Portfolio Website — Email Contact Form

## Aim
Develop a personal portfolio using HTML/CSS and frontend JavaScript, with Node.js and Express.js handling contact form submissions by email.

## Structure
```text
portfolio-fullstack/
├── package.json
├── server.js
├── .env.example
├── .env                 # Create locally; contains your private email credentials
├── .gitignore
├── README.md
└── public/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── tailwind-config.js
        └── main.js
```
The data folder from the earlier version is unused. New submissions are emailed and are no longer written to messages.jsonl. Any earlier saved messages are not automatically emailed.

## Gmail setup
1. Enable 2-Step Verification for the Google account that will send the emails: https://myaccount.google.com/security
2. Create a Google App Password: https://myaccount.google.com/apppasswords
   Google requires 2-Step Verification. App passwords may not be available for some managed or restricted accounts. See https://support.google.com/mail/answer/185833
3. Copy `.env.example` to a new file called `.env` in the project root, beside `server.js`.
4. Edit `.env`:
   ```dotenv
   PORT=3000
   SMTP_USER=ranjanadevi.180264@gmail.com
   SMTP_PASS=your_16_character_google_app_password
   CONTACT_TO=ranjanadevi.180264@gmail.com
   ```
   Replace the password placeholder with the actual App Password. Do not use your normal Google account password. Keep these values in `.env`, outside `public/`; do not share or commit that file. The included `.gitignore` excludes it.
   SMTP_USER is the Gmail account used to send. CONTACT_TO is the inbox receiving the submissions. They can be the same account.
5. Install Node.js 22 or newer. In a terminal inside the project folder, run:
   ```sh
   npm install
   npm start
   ```
6. Open http://localhost:3000 and submit the contact form. Check your inbox and spam folder.
7. Restart the server after changing `.env`.

Open the page through Express, not by double-clicking index.html or using Live Server. Your original Tailwind CDN and Google Fonts require internet access for the complete styling.

## How email delivery works
1. The frontend sends name, email and message as JSON to POST /api/contact.
2. Express validates required fields, field types, length and basic email format.
3. Nodemailer connects to Gmail SMTP over TLS on port 465 and authenticates using the configured account and App Password.
4. The authenticated Gmail account is the sender; the visitor's email is set as Reply-To. Click Reply in your inbox to respond to the visitor.
5. The email contains the visitor's name, email, message, timestamp and reference ID, as plain text.
6. The frontend displays success after the SMTP server accepts the message. SMTP acceptance does not guarantee inbox delivery; check spam as well.

No credentials are included in frontend code. No email is sent to the visitor. There is no local message storage in this version.

## API
POST /api/contact with Content-Type: application/json
```json
{
  "name": "Lab Visitor",
  "email": "visitor@example.com",
  "message": "I would like to discuss your portfolio project."
}
```
Responses:
- 200: email accepted by the mail server.
- 400: invalid fields or malformed JSON.
- 413: request body exceeds the size limit.
- 503: email credentials or receiving address have not been configured.
- 500: email could not be sent.

Name: 2–100 characters. Email: at most 254 characters. Message: 10–2000 characters. The server trims surrounding whitespace before validation.

## Laboratory demonstration
Show the portfolio, submit a message, inspect the POST /api/contact request in browser developer tools, and open the received email. Demonstrate the separate HTML, CSS, browser JavaScript and Express backend. Submit invalid data through an API client to demonstrate server-side validation. Existing project links with href="#" should be replaced with your actual project URLs.

This is a local laboratory project. A public deployment should include abuse controls to limit repeated submissions and use hosting that supports outbound SMTP.

## Troubleshooting
- Email service not configured: check that the file is named `.env`, not `.env.txt`, and that all three email fields have values; restart the server.
- Authentication failure: verify SMTP_USER and create a valid App Password for that same account.
- Connection failure: the machine running Node.js must be able to reach smtp.gmail.com on port 465.
- Success but no inbox message: check CONTACT_TO and the spam folder. Mail providers can filter or delay accepted mail.

References:
- https://nodemailer.com/smtp
- https://support.google.com/mail/answer/185833
