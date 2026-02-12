interface CourseEnrollmentEmailProps {
  courseName: string;
  name?: string;
}

export const courseEnrollmentEmail = ({
  courseName,
  name = "Student",
}: CourseEnrollmentEmailProps): string => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Course Enrollment Successful</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 20px;
        }
        .container {
          max-width: 560px;
          background: #ffffff;
          margin: auto;
          padding: 30px 25px;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          text-align: center;
        }
        .logo img {
          max-width: 140px;
          margin-bottom: 20px;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        p {
          color: #555;
          line-height: 1.6;
          font-size: 15px;
        }
        .course-box {
          background: #f0f7ff;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 16px;
          font-weight: bold;
          color: #2f80ed;
        }
        .cta {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #2f80ed;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: bold;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 30px;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <div class="logo">
          <img src="https://res.cloudinary.com/dnkhmmcgf/image/upload/v1770879435/Screenshot_2026-02-02_164007_vlvezj.png" alt="CodeStudy Logo" />
        </div>

        <h2>Enrollment Confirmed 🎉</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>
          Congratulations! You have been successfully enrolled in the course:
        </p>

        <div class="course-box">
          ${courseName}
        </div>

        <p>
          You can now access all course materials from your dashboard and start
          learning right away.
        </p>

        <a
          class="cta"
          href="#"
        >
          Go to Dashboard
        </a>

        <div class="footer">
          © ${new Date().getFullYear()} CodeStudy · All rights reserved
        </div>

      </div>
    </body>
  </html>
  `;
};
