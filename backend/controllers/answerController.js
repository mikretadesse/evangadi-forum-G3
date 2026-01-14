import db from "../config/database.js";
import { StatusCodes } from "http-status-codes";

/**
 * POST answer
 */
export const postAnswer = async (req, res) => {
  const { question_id } = req.params;
  const { answer } = req.body;
  const user_id = req.user.id;

  if (!answer?.trim()) return res.status(400).json({ msg: "Answer required" });

  await db
    .promise()
    .query(
      "INSERT INTO answers (question_id, user_id, answer) VALUES (?, ?, ?)",
      [question_id, user_id, answer.trim()]
    );

  res.status(201).json({ msg: "Answer posted" });
};

/**
 * GET answers
 */
export const getAllAnswer = async (req, res) => {
  const { question_id } = req.params;

  const [answers] = await db.promise().query(
    `SELECT a.answer_id, a.answer, a.likes, a.dislikes, a.created_at,
            u.username
     FROM answers a
     JOIN users u ON a.user_id = u.user_id
     WHERE a.question_id = ?
     ORDER BY a.created_at ASC`,
    [question_id]
  );

  res.json({ answers });
};

/**
 * DELETE answer
 */
export const deleteAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const user_id = req.user.id;

  const [rows] = await db
    .promise()
    .query("SELECT user_id FROM answers WHERE answer_id = ?", [answer_id]);

  if (!rows.length) return res.status(404).json({ msg: "Not found" });

  if (rows[0].user_id !== user_id)
    return res.status(403).json({ msg: "Forbidden" });

  await db
    .promise()
    .query("DELETE FROM answers WHERE answer_id = ?", [answer_id]);

  res.json({ msg: "Deleted" });
};

/**
 * EDIT answer
 */
export const editAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer } = req.body;
  const user_id = req.user.id;

  const [rows] = await db
    .promise()
    .query("SELECT user_id FROM answers WHERE answer_id = ?", [answer_id]);

  if (!rows.length) return res.status(404).json({ msg: "Not found" });

  if (rows[0].user_id !== user_id)
    return res.status(403).json({ msg: "Forbidden" });

  await db
    .promise()
    .query("UPDATE answers SET answer = ? WHERE answer_id = ?", [
      answer,
      answer_id,
    ]);

  res.json({ msg: "Updated" });
};

/**
 * VOTE answer
 */
export const voteAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { voteType } = req.body;
  const user_id = req.user.id;

  const [existing] = await db
    .promise()
    .query(
      "SELECT vote_type FROM answer_votes WHERE user_id=? AND answer_id=?",
      [user_id, answer_id]
    );

  if (existing.length) {
    if (existing[0].vote_type === voteType) {
      await db
        .promise()
        .query("DELETE FROM answer_votes WHERE user_id=? AND answer_id=?", [
          user_id,
          answer_id,
        ]);
      await db.promise().query(
        `UPDATE answers SET ${voteType === "upvote" ? "likes" : "dislikes"} =
         ${voteType === "upvote" ? "likes" : "dislikes"} - 1 WHERE answer_id=?`,
        [answer_id]
      );
      return res.json({ msg: "Vote removed" });
    }
  }

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
};
