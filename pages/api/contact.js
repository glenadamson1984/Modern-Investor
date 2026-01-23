import * as dotenv from "dotenv";
const sgMail = require("@sendgrid/mail");
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(404).json({ message: "Error sending email." });
    return;
  }

  const { name, phone, email, message } = req.body;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "info@modern-investor.co.uk",
    from: "info@modern-investor.co.uk",
    subject: "Modern Investor Contact Form Enquiry",
    text: `Name: ${name}
Phone: ${phone || "Not provided"}
Email: ${email}
Message: ${message}`,
    html: `<p><strong>New Contact Form Submission</strong></p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><em>Submitted: ${new Date().toLocaleString()}</em></p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ name: "Message sent successfully." });
  } catch (e) {
    console.error("SendGrid error:", e);
    res.status(502).json({
      message: `Error sending email.`,
    });
  }
}
