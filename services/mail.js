const nodemailer = require("nodemailer");

const formToEmail = process.env.FORM_TO_EMAIL;

// Gmail SMTP via Nodemailer (requires app password)
const gmailUser = process.env.GMAIL_USER || "rupzvirdi.96@gmail.com";
const gmailPassword = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPassword,
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

  if (!formToEmail) {
    throw new Error("FORM_TO_EMAIL is not configured in the environment");
  }

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

  if (!transporter) {
    throw new Error(
      "No email transport configured: GMAIL_APP_PASSWORD must be set",
    );
  }

  const info = await transporter.sendMail({
    from: `"Puncham Cars" <${gmailUser}>`,
    to: formToEmail,
    subject: "New Dream Car Form Submission",
    html,
  });

  console.log("DreamCar email sent via Nodemailer:", {
    messageId: info.messageId,
    envelope: info.envelope,
  });
}

module.exports = { sendDreamCarEmail };
