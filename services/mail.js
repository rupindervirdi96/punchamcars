const { Resend } = require("resend");
require("dotenv").config();

const formToEmail = process.env.FORM_TO_EMAIL;
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

async function sendDreamCarEmail(submission) {
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

  const result = await resend.emails.send({
    from: "Puncham Cars <onboarding@resend.dev>",
    to: [formToEmail],
    subject: "Dream car request received",
    html,
  });
  return result;
}

module.exports = { sendDreamCarEmail };
