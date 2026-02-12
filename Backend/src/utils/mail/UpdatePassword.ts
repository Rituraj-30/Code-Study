export const passwordUpdated = (
  email: string,
  name: string
): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Updated</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 140px;
      }
      h2 {
        color: #2c3e50;
      }
      p {
        color: #555;
        line-height: 1.6;
      }
      .alert {
        background: #fef3c7;
        padding: 12px;
        border-radius: 6px;
        margin: 20px 0;
        color: #92400e;
      }
      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #999;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="logo">
        <img src="https://res.cloudinary.com/dnkhmmcgf/image/upload/v1770879435/Screenshot_2026-02-02_164007_vlvezj.png" alt="StudyNotion Logo" />
      </div>

      <h2>Password Updated Successfully</h2>

      <p>Hi <strong>${name}</strong>,</p>

      <p>
        This is a confirmation that the password for your account
        (<strong>${email}</strong>) has been changed successfully.
      </p>

      <div class="alert">
        If you did not make this change, please reset your password immediately
        or contact our support team.
      </div>

      <p>
        For security reasons, we recommend keeping your password confidential
        and never sharing it with anyone.
      </p>

      <p>Thanks,<br/>Team Code-Study</p>

      <div class="footer">
        © ${new Date().getFullYear()} Code-Study. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
