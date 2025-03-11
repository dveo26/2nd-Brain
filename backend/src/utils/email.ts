import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string, 10),
    secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOTPEmail = async (email: string, otp: string) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP for email verification",
        html: `<p>Your OTP for signup at second brain is <strong>${otp}</strong></p>`,
    });
};