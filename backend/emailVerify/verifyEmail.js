import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,  // your Gmail
        pass: process.env.MAIL_PASS,  // app password
    }
});

const verifyEmail = async (token, email) => {
    if (!email) {
        console.log(" Email is undefined. Cannot send email!");
        return;
    }

    console.log("verifyEmail received:", email);

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,       // must be string
        subject: 'Email Verification',
        text: `Hi! There, You have recently visited our website and entered your email.
Please follow the given link to verify your email:
http://localhost/verify/${token}
Thanks`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
    } catch (error) {
        console.log("Email Error:", error);
    }
};

export default verifyEmail;