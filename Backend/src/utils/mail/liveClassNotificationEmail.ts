interface LiveClassEmailProps {
  courseName: string;
  name?: string;
  title: string;
  roomId: string;
  roomPassword?: string;
}

export const liveClassNotificationEmail = ({
  courseName,
  name = "Student",
  title,
  roomId,
  roomPassword,
}: LiveClassEmailProps): string => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Live Class Started</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px; }
        .container { max-width: 560px; background: #ffffff; margin: auto; padding: 30px 25px; border-radius: 10px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo img { max-width: 140px; }
        h2 { color: #ef4444; text-align: center; }
        .live-badge { background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .details-box { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #d0e3ff; }
        .info-row { margin-bottom: 10px; font-size: 15px; color: #333; }
        .label { font-weight: bold; color: #555; }
        .room-id { font-family: monospace; font-size: 18px; color: #2f80ed; font-weight: bold; }
        .cta { display: block; text-align: center; margin-top: 25px; padding: 12px 24px; background-color: #2f80ed; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; }
        .footer { font-size: 12px; color: #888; margin-top: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://res.cloudinary.com/dnkhmmcgf/image/upload/v1770879435/Screenshot_2026-02-02_164007_vlvezj.png" alt="CodeStudy Logo" />
        </div>
        <h2><span class="live-badge">🔴 LIVE NOW</span></h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your instructor has just started a live session for <strong>${courseName}</strong>. Join now to interact and learn in real-time!</p>
        
        <div class="details-box">
          <div class="info-row"><span class="label">Topic:</span> ${title}</div>
          <div class="info-row"><span class="label">Room ID:</span> <span class="room-id">${roomId}</span></div>
          ${roomPassword ? `<div class="info-row"><span class="label">Password:</span> ${roomPassword}</div>` : ""}
        </div>

        <a class="cta" href="#">
          Join Class Now
        </a>

        <p style="font-size: 13px; color: #666; margin-top: 15px;">
          Note: Please make sure you have a stable internet connection and a working microphone/camera.
        </p>

        <div class="footer">
          © ${new Date().getFullYear()} CodeStudy · All rights reserved
        </div>
      </div>
    </body>
  </html>
  `;
};