import nodemailer from "nodemailer";

// Create a transporter for Gmail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // app password
  },
});

// Function to send a general email (for registration, reminders, etc.)
export const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

// Email after the leave ends (reactivation)
export const sendReactivationEmail = async (to: string, name: string) => {
  const html = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Welcome back! Your leave period has ended and your status has been reactivated.</p>
    <p>We look forward to seeing you in class!</p>
    <p>Best regards,<br/>Dance Class Admin</p>
  `;
  await sendMail(to, "Welcome Back!", html);
};

// Payment Confirmation Email
export const sendPaymentConfirmation = async (email: string, amount: number, month: string) => {
  try {
    const html = `
      <p>Dear Student,</p>
      <p>We have successfully received your payment of ₹${amount} for the month of ${month}.</p>
      <p>Thank you for your timely payment!</p>
      <p>Best regards,<br/>Dance Class Admin</p>
    `;
    await sendMail(email, "Payment Confirmation", html);
    console.log("Payment confirmation email sent successfully.");
  } catch (err) {
    console.error("Error sending payment confirmation:", err);
  }
};
