const { Resend } = require("resend");
require("dotenv").config();

const formToEmail = process.env.FORM_TO_EMAIL;
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

async function sendDreamCarEmail(submission) {
  const fullName = [submission.firstName, submission.lastName]
    .filter(Boolean)
    .join(" ") || submission.name || "N/A";
  const birthDate = submission.birthDate;
  const birthDateDisplay = birthDate
    ? `${birthDate.day}-${birthDate.month}-${birthDate.year}`
    : "N/A";
  const addressDisplay = submission.address || "N/A";
  const addressWithUnit = submission.apartment
    ? `${addressDisplay}, ${submission.apartment}`
    : addressDisplay;
  const vehicleType = submission.vehicleType || "N/A";
  const creditStatus = submission.creditStatus || submission.creditScore || "N/A";
  const employmentStatus = submission.employmentStatus || "N/A";
  const biweeklyBudget = submission.biweeklyBudgetRange
    || (typeof submission.biweeklyBudget === "number"
      ? `$${submission.biweeklyBudget}`
      : submission.biweeklyBudget)
    || "N/A";
  const incomeRange = submission.incomeRange || "N/A";
  const livingDuration = submission.livingDuration || "N/A";

  const yearRangeDisplay = submission.yearFrom && submission.yearTo
    ? `${submission.yearFrom} – ${submission.yearTo}`
    : "N/A";

  const html = `
    <div style="margin:0;padding:24px;background-color:#0b1120;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:640px;margin:0 auto;background-color:#020617;border-radius:18px;padding:24px 26px 22px;border:1px solid #1d4ed8;color:#e5e7eb;">
        <h2 style="margin:0 0 4px;font-size:20px;color:#f9fafb;">New Dream Car Request</h2>
        <p style="margin:0 0 18px;font-size:13px;color:#9ca3af;">Someone just submitted their dream car preferences from your website.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:13px;">
          <tbody>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Name</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Email</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${submission.email}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Phone</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${submission.phone}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Vehicle Type</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${vehicleType}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Birthdate</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${birthDateDisplay}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Address</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${addressWithUnit}</td>
            </tr>
            <tr>
              <td style="padding:10px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;border-top:1px solid #1f2937;">Biweekly Budget</td>
              <td style="padding:10px 0 4px;color:#bbf7d0;border-top:1px solid #1f2937;">${biweeklyBudget}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Year Range</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${yearRangeDisplay}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Credit Score</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${creditStatus}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Employment</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${employmentStatus}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Income</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${incomeRange}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 4px;width:32%;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Time at Address</td>
              <td style="padding:6px 0 4px;color:#e5e7eb;">${livingDuration}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:16px;padding-top:10px;border-top:1px solid #1f2937;">
          <div style="margin:0 0 4px;color:#9ca3af;font-weight:600;text-transform:uppercase;font-size:11px;">Additional Details</div>
          <p style="margin:0;font-size:13px;line-height:1.4;color:#e5e7eb;">${submission.extraDetails || "N/A"}</p>
        </div>

        <p style="margin:18px 0 0;font-size:11px;color:#6b7280;">Sent automatically from the Puncham Cars website.</p>
      </div>
    </div>
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
