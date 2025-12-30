import db from '../config/database.js';


// Create a Question
export async function createQuestion({ title, description, options, correctAnswer }) {
  if (!Array.isArray(options)) {
    throw new Error('Options must be an array');
  }

  const [result] = await db.query(
    `INSERT INTO questions (title, description, options, correct_answer)
     VALUES (?, ?, ?, ?)`,
    [title, description, JSON.stringify(options), correctAnswer]
  );

  return result.insertId;
}

//Get all Questions
export async function getAllQuestions() {
  const [rows] = await db.query(`SELECT * FROM questions ORDER BY created_at DESC`);
  
  // Parse JSON options
  return rows.map(row => ({
    ...row,
    options: JSON.parse(row.options || '[]')
  }));
}

// Get a single Question by ID
export async function getQuestionById(id) {
  const [rows] = await db.query(`SELECT * FROM questions WHERE id = ?`, [id]);
  if (rows.length === 0) return null;

  const question = rows[0];
  question.options = JSON.parse(question.options || '[]');
  return question;
}

// Update a Question
export async function updateQuestion(id, { title, description, options, correctAnswer }) {
  if (options && !Array.isArray(options)) {
    throw new Error('Options must be an array');
  }

  await db.query(
    `UPDATE questions
     SET title = ?, description = ?, options = ?, correct_answer = ?, updated_at = NOW()
     WHERE id = ?`,
    [title, description, JSON.stringify(options), correctAnswer, id]
  );
}

//  Delete a Question
export async function deleteQuestion(id) {
  await db.query(`DELETE FROM questions WHERE id = ?`, [id]);
}