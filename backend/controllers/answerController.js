import db from "../config/database.js";

/**
 * POST answer
 * Endpoint: POST /api/answer/:question_id
 */
export const postAnswer = async (req, res) => {
  const { question_id } = req.params;
  let { answer } = req.body; // use let because we trim it
  const user_id = req.user.id;

  if (!answer?.trim()) return res.status(400).json({ msg: "Answer required" });
  if (!question_id || isNaN(parseInt(question_id, 10))) {
    return res.status(400).json({ msg: "Invalid question ID" });
  }

  answer = answer.trim();

  try {
    const [questionRows] = await db
      .promise()
      .query("SELECT question_id FROM questions WHERE question_id=?", [
        question_id,
      ]);

    if (!questionRows.length)
      return res.status(404).json({ msg: "Question not found" });

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO answers (question_id, user_id, answer) VALUES (?, ?, ?)",
        [question_id, user_id, answer]
      );

    res
      .status(201)
      .json({ msg: "Answer posted successfully", answer_id: result.insertId });
  } catch (err) {
    console.error("Post answer error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * GET all answers for a question
 * Endpoint: GET /api/answer/:question_id
 */
export const getAllAnswer = async (req, res) => {
  const { question_id } = req.params;

  try {
    const [answers] = await db.promise().query(
      `SELECT a.answer_id, a.answer, a.likes, a.dislikes, a.created_at,
                u.username, u.user_id
         FROM answers a
         JOIN users u ON a.user_id = u.user_id
         WHERE a.question_id=?
         ORDER BY a.created_at ASC`,
      [question_id]
    );

    res.json({ answers });
  } catch (err) {
    console.error("Get answers error:", err);
    res.status(500).json({ msg: "Failed to get answers" });
  }
};

/**
 * DELETE answer
 * Endpoint: DELETE /api/answer/:answer_id
 */
export const deleteAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const user_id = req.user.id;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT user_id FROM answers WHERE answer_id=?", [answer_id]);

    if (!rows.length) return res.status(404).json({ msg: "Answer not found" });
    if (rows[0].user_id !== user_id)
      return res.status(403).json({ msg: "Forbidden" });

    await db
      .promise()
      .query("DELETE FROM answers WHERE answer_id=?", [answer_id]);
    res.json({ msg: "Answer deleted successfully" });
  } catch (err) {
    console.error("Delete answer error:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
};

/**
 * EDIT answer
 * Endpoint: PUT /api/answer/:answer_id
 */
export const editAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer } = req.body;
  const user_id = req.user.id;

  if (!answer?.trim()) return res.status(400).json({ msg: "Answer required" });

  try {
    const [rows] = await db
      .promise()
      .query("SELECT user_id FROM answers WHERE answer_id=?", [answer_id]);

    if (!rows.length) return res.status(404).json({ msg: "Answer not found" });
    if (rows[0].user_id !== user_id)
      return res.status(403).json({ msg: "Forbidden" });

    await db
      .promise()
      .query("UPDATE answers SET answer=? WHERE answer_id=?", [
        answer.trim(),
        answer_id,
      ]);

    res.json({ msg: "Answer updated successfully" });
  } catch (err) {
    console.error("Edit answer error:", err);
    res.status(500).json({ msg: "Update failed" });
  }
};

/**
 * VOTE answer
 * Endpoint: POST /api/answer/vote/:answer_id
 */
export const voteAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { voteType } = req.body; // "upvote" or "downvote"
  const user_id = req.user.id;

  try {
    const [existing] = await db
      .promise()
      .query(
        "SELECT vote_type FROM answer_votes WHERE user_id=? AND answer_id=?",
        [user_id, answer_id]
      );

    // If the same vote exists, remove it
    if (existing.length && existing[0].vote_type === voteType) {
      await db
        .promise()
        .query("DELETE FROM answer_votes WHERE user_id=? AND answer_id=?", [
          user_id,
          answer_id,
        ]);
      await db.promise().query(
        `UPDATE answers SET ${voteType === "upvote" ? "likes" : "dislikes"} =
           ${
             voteType === "upvote" ? "likes" : "dislikes"
           } - 1 WHERE answer_id=?`,
        [answer_id]
      );
      return res.json({ msg: "Vote removed" });
    }

    // Insert or update vote
    await db
      .promise()
      .query(
        "REPLACE INTO answer_votes (user_id, answer_id, vote_type) VALUES (?, ?, ?)",
        [user_id, answer_id, voteType]
      );
    await db.promise().query(
      `UPDATE answers SET ${voteType === "upvote" ? "likes" : "dislikes"} =
         ${voteType === "upvote" ? "likes" : "dislikes"} + 1 WHERE answer_id=?`,
      [answer_id]
    );

    res.json({ msg: "Vote updated" });
  } catch (err) {
    console.error("Vote answer error:", err);
    res.status(500).json({ msg: "Vote failed" });
  }
};
