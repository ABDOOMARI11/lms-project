require('dotenv').config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '507'),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const { email, subject, template, data } = options;

  console.log("Sending email to:", email);
  console.log("Subject:", subject);
  console.log("Template:", template);
  console.log("Data:", data);

  const templatePath = path.join(__dirname, "../mails", template);

  console.log("Template path:", templatePath);

  try {
    const html: string = await ejs.renderFile(templatePath, data);

  

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html
    };

    console.log("Sending email...");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export default sendMail;
