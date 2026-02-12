export const contactUsEmail = (name: string): string => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { background-color: #f4f4f4; font-family: sans-serif; }
            .container { background-color: #ffffff; margin: 20px auto; padding: 20px; max-width: 600px; border-radius: 10px; border: 1px solid #ddd; }
            .header { font-size: 24px; font-weight: bold; color: #00cfec; text-align: center; }
            .content { font-size: 16px; color: #333; line-height: 1.6; margin-top: 20px; }
            .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">CodeStudy</div>
            <div class="content">
                <p>Hey ${name},</p>
                <p>Thank you for reaching out to us! We have received your message and our team is looking into it.</p>
                <p>We usually respond within 24 hours. In the meantime, feel free to explore more coding resources on our platform.</p>
                <p>Best Regards,<br>Team CodeStudy</p>
            </div>
            <div class="footer">© 2026 CodeStudy. All rights reserved.</div>
        </div>
    </body>
    </html>`;
};