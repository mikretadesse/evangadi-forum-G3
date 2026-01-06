--  1. Create Database
CREATE DATABASE IF NOT EXISTS evangadi_forum;
USE evangadi_forum;

-- 2. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    COLUMN reset_otp VARCHAR(6) NULL,
    COLUMN reset_otp_expiry BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  3. Questions Table
CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers(
  answer_id INT AUTO_INCREMENT PRIMARY KEY,
  answer_body TEXT NOT NULL,
  user_id INT NOT NULL,
  question_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE  -- FIXED: Added parentheses
);

-- Comments table for answers
CREATE TABLE IF NOT EXISTS comments(
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  comment_body TEXT NOT NULL,
  user_id INT NOT NULL,
  answer_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (answer_id) REFERENCES answers(answer_id) ON DELETE CASCADE
);
-- Answer votes table
CREATE TABLE IF NOT EXISTS answer_votes (
  vote_id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL,
  answerid INT NOT NULL,
  vote_type ENUM('upvote', 'downvote') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_answer_vote UNIQUE (userid, answerid),
  FOREIGN KEY (userid) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (answerid) REFERENCES answers(answer_id) ON DELETE CASCADE
);
