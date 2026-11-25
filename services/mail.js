const { Resend } = require("resend");
require("dotenv").config();

const formToEmail = process.env.FORM_TO_EMAIL;
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

/* ─── Helpers ─────────────────────────────────────────────────── */

// Everything in the email comes from the public form, so escape it.
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const clean = (value) => (typeof value === "string" ? value.trim() : value ? String(value) : "");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatBirthDate(birthDate) {
  if (!birthDate || !birthDate.day || !birthDate.month || !birthDate.year) return "";
  const month = MONTHS[Number(birthDate.month) - 1];
  if (!month) return "";
  const born = new Date(Date.UTC(Number(birthDate.year), Number(birthDate.month) - 1, Number(birthDate.day)));
  const now = new Date();
  let age = now.getUTCFullYear() - born.getUTCFullYear();
  const hadBirthday =
    now.getUTCMonth() > born.getUTCMonth() ||
    (now.getUTCMonth() === born.getUTCMonth() && now.getUTCDate() >= born.getUTCDate());
  if (!hadBirthday) age -= 1;
  return `${month} ${Number(birthDate.day)}, ${birthDate.year} (age ${age})`;
}

// "2026-11-27" → "Friday, November 27, 2026"
function formatCallDate(dateStr) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean(dateStr));
  if (!m) return clean(dateStr);
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatPhone(phone) {
  const digits = clean(phone).replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return clean(phone);
}

/* ─── Email building blocks (inline styles for email clients) ─── */

const C = {
  // Same scheme as the website (client/tailwind.config.js)
  bg: "#F5F3EE", // canvas
  card: "#FFFFFF", // surface
  line: "#E4E1DA",
  text: "#15171B", // ink
  muted: "#6E7178",
  accent: "#2445FF", // cobalt
  accentSoft: "#ECEFFF",
  font: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
};

const NOT_ANSWERED = `<span style="color:${C.muted};">Skipped</span>`;

function row(label, valueHtml) {
  return `
    <tr>
      <td style="padding:11px 0;width:38%;vertical-align:top;border-bottom:1px solid ${C.line};font-family:${C.font};font-size:14px;color:${C.muted};">${label}</td>
      <td style="padding:11px 0;vertical-align:top;border-bottom:1px solid ${C.line};font-family:${C.font};font-size:15px;color:${C.text};">${valueHtml || NOT_ANSWERED}</td>
    </tr>`;
}

function section(title, rowsHtml) {
  return `
    <tr><td style="padding:28px 0 2px;font-family:${C.font};font-size:15px;font-weight:600;color:${C.text};">${title}</td></tr>
    <tr><td>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${rowsHtml}</table>
    </td></tr>`;
}

const formatNumber = (digits) => {
  const n = Number(String(digits || "").replace(/\D/g, ""));
  return n ? n.toLocaleString("en-CA") : "";
};

function tradeInRows(s, e) {
  if (s.tradeIn === "No") return row("Trade-in", "No trade-in");
  if (s.tradeIn !== "Yes") return row("Trade-in", "");

  const vehicle = [clean(s.tradeInYear), clean(s.tradeInMake), clean(s.tradeInModel)].filter(Boolean).join(" ");
  const km = formatNumber(s.tradeInKm);
  let loan = "";
  if (s.tradeInHasLoan === "No") loan = "No, paid off";
  if (s.tradeInHasLoan === "Yes") loan = "Yes";

  const balance = formatNumber(s.tradeInBalance);
  return (
    row("Vehicle", vehicle ? escapeHtml(vehicle) : "") +
    row("Kilometres", km ? `${km} km` : "") +
    row("Outstanding loan", loan) +
    (s.tradeInHasLoan === "Yes"
      ? row("Lender", e(s.tradeInLender)) + row("Balance owing", balance ? `≈ $${balance}` : `<span style="color:${C.muted};">Not provided</span>`)
      : "")
  );
}

function buildDreamCarEmail(submission) {
  const s = submission || {};
  const e = (v) => (clean(v) ? escapeHtml(clean(v)) : "");

  const firstName = clean(s.firstName);
  const fullName = [firstName, clean(s.lastName)].filter(Boolean).join(" ") || "New customer";
  const email = clean(s.email);
  const phoneDigits = clean(s.phone).replace(/\D/g, "");
  const phonePretty = formatPhone(s.phone);
  const vehicleType = clean(s.vehicleType);

  const callDate = clean(s.callDate);
  const callTime = clean(s.callTime);
  const callWhen = callDate && callTime ? `${formatCallDate(callDate)} at ${callTime}` : "";

  const address = clean(s.address);
  const fullAddress = [address, clean(s.apartment)].filter(Boolean).join(", ");
  const mapsUrl = address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : "";

  const phoneHtml = phoneDigits
    ? `<a href="tel:+1${escapeHtml(phoneDigits)}" style="color:${C.text};text-decoration:none;">${escapeHtml(phonePretty)}</a>`
    : "";
  const emailHtml = email
    ? `<a href="mailto:${escapeHtml(email)}" style="color:${C.accent};text-decoration:none;">${escapeHtml(email)}</a>`
    : "";
  const addressHtml = fullAddress
    ? `${escapeHtml(fullAddress)}<br><a href="${escapeHtml(mapsUrl)}" style="font-size:13px;color:${C.accent};text-decoration:none;">Open in Maps</a>`
    : "";

  const button = (href, label, primary) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 20px;border-radius:999px;font-family:${C.font};font-size:14px;font-weight:600;text-decoration:none;${
      primary ? `background:${C.accent};color:#FFFFFF;border:1px solid ${C.accent};` : `background:${C.card};color:${C.text};border:1px solid ${C.line};`
    }">${label}</a>`;

  const actions = [
    phoneDigits && button(`tel:+1${phoneDigits}`, `Call ${firstName || "them"}`, true),
    phoneDigits && button(`https://wa.me/1${phoneDigits}`, "WhatsApp", false),
    email && button(`mailto:${email}`, "Email", false),
  ]
    .filter(Boolean)
    .join("");

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:${C.bg};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};">
    <tr><td align="center" style="padding:32px 14px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
        <tr><td style="padding:0 4px 16px;font-family:${C.font};font-size:15px;font-weight:800;letter-spacing:-0.2px;text-transform:uppercase;color:${C.text};">
          Puncham <span style="display:inline-block;padding:3px 6px;border-radius:4px;background:${C.accent};color:#FFFFFF;">Cars</span>
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:24px;">
        <tr><td style="padding:32px 32px 30px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">

            <tr><td style="font-family:${C.font};font-size:14px;color:${C.muted};">New request</td></tr>
            <tr><td style="padding-top:4px;font-family:${C.font};font-size:26px;font-weight:600;letter-spacing:-0.4px;line-height:1.2;color:${C.text};">${escapeHtml(fullName)}</td></tr>
            <tr><td style="padding-top:4px;font-family:${C.font};font-size:15px;color:${C.muted};">
              ${vehicleType ? escapeHtml(vehicleType) : "Vehicle not chosen"}${
                clean(s.biweeklyBudgetRange) ? ` · ${e(s.biweeklyBudgetRange)} biweekly` : ""
              }${s.tradeIn === "Yes" ? " · Trade-in" : ""}
            </td></tr>

            <tr><td style="padding-top:22px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${callWhen ? C.accentSoft : C.bg};border-radius:16px;">
                <tr><td style="padding:16px 18px;">
                  <div style="font-family:${C.font};font-size:13px;color:${C.muted};">Call booked for</div>
                  <div style="padding-top:2px;font-family:${C.font};font-size:18px;font-weight:600;color:${callWhen ? C.accent : C.muted};">
                    ${callWhen ? escapeHtml(callWhen) : "No call time picked"}
                  </div>
                </td></tr>
              </table>
            </td></tr>

            ${actions ? `<tr><td style="padding-top:18px;">${actions}</td></tr>` : ""}

            ${section(
              "Contact",
              row("Phone", phoneHtml) + row("Email", emailHtml) + row("Address", addressHtml) + row("Time at address", e(s.livingDuration))
            )}

            ${section(
              "Vehicle &amp; budget",
              row("Vehicle type", e(s.vehicleType)) + row("Biweekly budget", e(s.biweeklyBudgetRange))
            )}

            ${section("Trade-in", tradeInRows(s, e))}

            ${section(
              "Financial profile",
              row("Credit", e(s.creditStatus)) +
                row("Employment", e(s.employmentStatus)) +
                row("Monthly income", e(s.incomeRange)) +
                row("Birthdate", escapeHtml(formatBirthDate(s.birthDate)))
            )}

          </table>
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
        <tr><td style="padding:16px 4px 0;font-family:${C.font};font-size:12px;color:${C.muted};">
          From the punchamcars.ca questionnaire${email ? " · Reply to answer the customer directly" : ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const subjectBits = [vehicleType, callWhen ? `call ${callWhen}` : ""].filter(Boolean).join(" · ");
  const subject = `New car request: ${fullName}${subjectBits ? ` (${subjectBits})` : ""}`;

  return { html, subject, replyTo: email || undefined };
}

async function sendDreamCarEmail(submission) {
  const { html, subject, replyTo } = buildDreamCarEmail(submission);

  const result = await resend.emails.send({
    from: "Puncham Cars <onboarding@resend.dev>",
    to: [formToEmail],
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
  return result;
}

module.exports = { sendDreamCarEmail, buildDreamCarEmail };
