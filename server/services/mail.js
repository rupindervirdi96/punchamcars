const nodemailer = require("nodemailer");

// Use Gmail SMTP via Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "rupzvirdi.96@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendDreamCarEmail(submission) {
  const {
    name,
    email,
    phone,
    maxBudget,
    yearFrom,
    yearTo,
    creditScore,
    extraDetails,
  } = submission;

  const html = `
    <h2>New Dream Car Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Max budget:</strong> $${maxBudget}</p>
    <p><strong>Preferred years:</strong> ${yearFrom} – ${yearTo}</p>
    <p><strong>Credit score:</strong> ${creditScore}</p>
    <p><strong>Details:</strong><br>${extraDetails || "N/A"}</p>
  `;

  const info = await transporter.sendMail({
    from: `"Puncham Cars" rupzvirdi.96@gmail.com`,
    to: process.env.FORM_TO_EMAIL,
    subject: "New Dream Car Form Submission",
    html,
  });

  console.log("DreamCar email sent via Nodemailer:", {
    messageId: info.messageId,
    envelope: info.envelope,
  });
}

module.exports = { sendDreamCarEmail };
