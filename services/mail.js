const nodemailer = require("nodemailer");

const formToEmail = process.env.FORM_TO_EMAIL;
const gmailUser = process.env.GMAIL_USER;
const gmailPassword = process.env.GMAIL_APP_PASSWORD;

if (!gmailUser || !gmailPassword) {
  console.error("Gmail credentials missing");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: gmailUser,
    pass: gmailPassword,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

async function sendDreamCarEmail(submission) {
  if (!formToEmail) {
    throw new Error("FORM_TO_EMAIL not configured");
  }

  const html = `
    <h2>New Dream Car Request</h2>
    <p><strong>Name:</strong> ${submission.name}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>Phone:</strong> ${submission.phone}</p>
    <p><strong>Max budget:</strong> $${submission.maxBudget}</p>
    <p><strong>Preferred years:</strong> ${submission.yearFrom} – ${submission.yearTo}</p>
    <p><strong>Credit score:</strong> ${submission.creditScore}</p>
    <p><strong>Details:</strong><br>${submission.extraDetails || "N/A"}</p>
  `;

  return transporter.sendMail({
    from: `"Puncham Cars" <${gmailUser}>`,
    to: formToEmail,
    subject: "New Dream Car Form Submission",
    html,
  });
}

module.exports = { sendDreamCarEmail };
