import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";

interface MailSenderResponse extends SentMessageInfo {}

const mailSender = async (
  email: string,
  title: string,
  body: string
): Promise<MailSenderResponse | undefined> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"CodeStudy" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (error) {
    console.error("Error while sending mail:", email);
    console.error(error);
    return undefined;
  }
};

export default mailSender;
