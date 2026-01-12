import db from "../config/database.js";
export const getNotifications = async (req, res) => {
  const user_id = req.user.id;

  const [rows] = await db.query(
    `SELECT * FROM notifications
     WHERE user_id=?
     ORDER BY created_at DESC`,
    [user_id]
  );

  res.json(rows);
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  await db.query("UPDATE notifications SET is_read=1 WHERE notification_id=?", [
    id,
  ]);

  res.json({ message: "Notification marked as read" });
};
