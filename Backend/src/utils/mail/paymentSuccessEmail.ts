interface PaymentSuccessEmailProps {
  name?: string;
  amount: number;
  orderId: string;
  paymentId: string;
}

export const paymentSuccessEmail = ({
  name = "User",
  amount,
  orderId,
  paymentId,
}: PaymentSuccessEmailProps): string => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Payment Successful</title>
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
          color: #16a34a;
          margin-bottom: 10px;
        }
        p {
          color: #555;
          line-height: 1.6;
          font-size: 15px;
        }
        .amount {
          font-size: 28px;
          font-weight: bold;
          color: #16a34a;
          margin: 20px 0;
        }
        .details {
          background: #f9fafb;
          border-radius: 8px;
          padding: 15px;
          text-align: left;
          font-size: 14px;
          margin-top: 20px;
        }
        .details p {
          margin: 6px 0;
          color: #333;
        }
        .cta {
          display: inline-block;
          margin-top: 25px;
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

        <h2>Payment Successful 🎉</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>
          Thank you for your payment! Your transaction was completed
          successfully.
        </p>

        <div class="amount">₹${amount}</div>

        <div class="details">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Status:</strong> Successful</p>
        </div>

        <p>
          You can now access your purchased courses from your dashboard and
          continue your learning journey 🚀
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
