import db from '../config/database.js';
//  Create a new user
export async function createUser({ user_name, email, password, profile_picture = null, bio = null }) {
  if (!user_name || user_name.length < 3) {
    throw new Error('Username must be at least 3 characters long.');
  }
  if (!email || !email.includes('@')) {
    throw new Error('A valid email is required.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const [result] = await db.query(
    `INSERT INTO users (user_name, email, password, profile_picture, bio)
     VALUES (?, ?, ?, ?, ?)`,
    [user_name, email, password, profile_picture, bio]
  );

  return result.insertId;
}

// Get all users
export async function getAllUsers() {
  const [rows] = await db.query(`SELECT * FROM users ORDER BY created_at DESC`);
  return rows;
}

// Get user by ID
export async function getUserById(id) {
  const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

// Get user by email or username (for login)
export async function getUserByEmailOrUsername(identifier) {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE email = ? OR user_name = ?`,
    [identifier, identifier]
  );
  return rows[0] || null;
}

//  Update user info
export async function updateUser(id, { user_name, email, bio, profile_picture }) {
  await db.query(
    `UPDATE users
     SET user_name = ?, email = ?, bio = ?, profile_picture = ?, updated_at = NOW()
     WHERE id = ?`,
    [user_name, email, bio, profile_picture, id]
  );
}

// Delete user
export async function deleteUser(id) {
  await db.query(`DELETE FROM users WHERE id = ?`, [id]);
}