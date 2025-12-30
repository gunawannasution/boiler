import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export async function sendResetEmail(email, link) {
    await transporter.sendMail({
        from: '"My App" <no-reply@myapp.com>',
        to: email,
        subject: "Reset Password",
        html: `
      <p>Klik link berikut untuk reset password:</p>
      <a href="${link}">${link}</a>
      <p>Link berlaku 15 menit</p>
    `
    });
}
