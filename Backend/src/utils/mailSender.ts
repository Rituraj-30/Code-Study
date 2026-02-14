


import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";

interface MailSenderResponse extends SentMessageInfo {}

const mailSender = async (
  email: string,
  title: string,
  body: string
): Promise<MailSenderResponse | undefined> => {
  try {
     const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
    minVersion: "TLSv1.2"
  }
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



// import { Resend } from "resend";


// const resend = new Resend(process.env.RESEND_API_KEY!);

// interface SendMailProps {
//   to: string;
//   subject: string;
//   html: string;
// }

// const mailSender = async ({ to, subject, html }: SendMailProps) => {
//   try {
//     const response = await resend.emails.send({
//       from: process.env.MAIL_FROM!,
//       to,
//       subject,
//       html,
//     });

//     return response;
//   } catch (error) {
//     console.error("❌ Email send error:", error);
//     throw error;
//   }
// };

// export default mailSender;


