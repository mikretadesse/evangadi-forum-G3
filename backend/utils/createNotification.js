import db from "../config/database.js";
import transporter from "../config/email.js";

const createNotification = async ({
  user_id,
  sender_id,
  type,
  target_id,
  target_type,
  message,
}) => {
  // Save notification
  await db.query(
    `INSERT INTO notifications
     (user_id, sender_id, type, target_id, target_type, message)
     VALUES (?,?,?,?,?,?)`,
    [user_id, sender_id, type, target_id, target_type, message]
  );

  // EMAIL ONLY FOR ANSWERS
  if (type === "answer") {
    const [[user]] = await db.query("SELECT email FROM users WHERE user_id=?", [
      user_id,
    ]);

    if (user?.email) {
      await transporter.sendMail({
        to: user.email,
        subject: "New Answer on Your Question – Evangadi Forum",
        html: `
          <p>Hello,</p>
          <p>Your question has received a new answer.</p>
          <p><b>${message}</b></p>
          <p>Visit Evangadi Forum to view the answer.</p>
        `,
      });
    }
  }
};

export default createNotification;
