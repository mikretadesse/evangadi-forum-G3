import db from '../config/database.js';

// Insert a new answer
export async function createAnswer({ question_id, user_id, content, user_name }) {
  const [result] = await db.query(
    `INSERT INTO answers (question_id, user_id, content, user_name) VALUES (?, ?, ?, ?)`,
    [question_id, user_id, content, user_name]
  );
  return result.insertId;
}
// Get all answers for a question
export async function getAnswersByQuestion(question_id) {
  const [rows] = await db.query(
    `SELECT * FROM answers WHERE question_id = ? ORDER BY created_at DESC`,
    [question_id]
  );
  return rows;
}
// Get a single answer by ID
export async function getAnswerById(id) {
  const [rows] = await db.query(`SELECT * FROM answers WHERE id = ?`, [id]);
  return rows[0];
}

// Update an answer
export async function updateAnswer(id, content) {
  await db.query(
    `UPDATE answers SET content = ?, updated_at = NOW() WHERE id = ?`,
    [content, id]
  );
}

// Delete an answer
export async function deleteAnswer(id) {
  await db.query(`DELETE FROM answers WHERE id = ?`, [id]);
}