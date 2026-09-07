import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
export const sendVerificationEmail = async (email, verificationCode) => {
    const url =`http://localhost:8000/api/auth/verify-email`;
    const mailOptions = {
        from:`"login-app: " ${process.env.EMAIL_USER}`,
        to: email,
        subject: "verify your email:",
        html:`
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;"> Hi!</h2>
            <p style="color: #666; font-size: 16px;">Thank you for registering. Please use the following verification code to activate your account:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; background: #f0f5ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #2563eb;">
                    ${verificationCode}
                </span>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
                ⏰ This code is valid for <strong>10 minutes</strong> only.
            </p>
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
               if you did not request this code, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 10px;">
                Best regards,
            </p>
        </div>
        `,
    };
    await transporter.sendMail(mailOptions);
}