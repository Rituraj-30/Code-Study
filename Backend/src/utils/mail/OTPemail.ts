interface OtpEmailProps {
  name?: string;
  otp: string;
  expiresInMinutes?: number;
}

export const otpEmailTemplate = ({
  name = "User",
  otp,
  expiresInMinutes = 10,
}: OtpEmailProps): string => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 20px;
        }
        .container {
          max-width: 520px;
          background: #ffffff;
          margin: auto;
          padding: 30px 25px;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo img {
          max-width: 140px;
        }
        .otp {
          font-size: 30px;
          font-weight: bold;
          color: #2f80ed;
          letter-spacing: 6px;
          margin: 24px 0;
          text-align: center;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 30px;
          text-align: center;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <div class="logo">
          <img src="https://res.cloudinary.com/dnkhmmcgf/image/upload/v1770879435/Screenshot_2026-02-02_164007_vlvezj.png" alt="CodeStudy Logo" />
        </div>

        <h2>Hello ${name} 👋</h2>

        <p>
          Welcome to <b>CodeStudy</b>!  
          Use the OTP below to verify your email address.
        </p>

        <div class="otp">${otp}</div>

        <p>
          This OTP is valid for <b>${expiresInMinutes} minutes</b>.
          Please do not share it with anyone.
        </p>

        <p>If you didn’t request this, you can safely ignore this email.</p>

        <div class="footer">
          © ${new Date().getFullYear()} CodeStudy · All rights reserved
        </div>

      </div>
    </body>
  </html>
  `;
};
