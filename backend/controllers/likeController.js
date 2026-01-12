import db from "../config/database.js";
import createNotification from "../utils/createNotification.js";

export const toggleLike = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { target_id, target_type, owner_id } = req.body;

    const [existing] = await db.query(
      `SELECT like_id FROM likes
       WHERE user_id=? AND target_id=? AND target_type=?`,
      [user_id, target_id, target_type]
    );

    // UNLIKE
    if (existing.length > 0) {
      await db.query(
        `DELETE FROM likes
         WHERE user_id=? AND target_id=? AND target_type=?`,
        [user_id, target_id, target_type]
      );
      return res.json({ liked: false });
    }

    // LIKE
    await db.query(
      `INSERT INTO likes (user_id, target_id, target_type)
       VALUES (?,?,?)`,
      [user_id, target_id, target_type]
    );

    // NOTIFICATION
    if (owner_id && owner_id !== user_id) {
      await createNotification({
        user_id: owner_id,
        sender_id: user_id,
        type: "LIKE",
        target_id,
        target_type,
        message: "liked your post",
      });
    }

    res.json({ liked: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Like toggle failed" });
  }
};

export const getLikeCount = async (req, res) => {
  try {
    const { type, id } = req.params;

    const [[result]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM likes
       WHERE target_type=? AND target_id=?`,
      [type, id]
    );

    res.json({ count: result.count });
  } catch {
    res.status(500).json({ error: "Failed to get like count" });
  }
};
