import db from "../config/database.js";
import { StatusCodes } from "http-status-codes";
/**
 * Post a new answer for a question
 * Endpoint: POST /api/answer/:question_id
 * Protected route (requires JWT)
 */

export const postAnswer = async (req, res) => {
  const { question_id } = req.params;
  let { answer } = req.body;
  const user_id = req.user?.id; // Comes from JWT middleware
  // 1. Check authentication
  if (!user_id) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required",
    });
  }
  // 2. Validate question_id
  if (!question_id || isNaN(parseInt(question_id, 10))) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Question ID must be a valid number",
    });
  }
  // 3. Validate answer content
  if (!answer || answer.trim() === "") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide answer",
    });
  }
  answer = answer.trim();
  try {
    // 4. Check if the question exists
    const [questionRows] = await db
      .promise()
      .query("SELECT question_id FROM questions WHERE question_id = ?", [
        question_id,
      ]);
    if (questionRows.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "The specified question could not be found",
      });
    }
    // 5. Insert new answer
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO answers (question_id, user_id, answer_body) VALUES (?, ?, ?)",
        [question_id, user_id, answer]
      );
    // 6. Send success response
    res.status(201).json({
      message: "Answer posted successfully",
      answer_id: result.insertId,
      question_id,
      user_id,
      answer,
    });
  } catch (err) {
    console.error("Post answer error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Get all answers for a specific question
export const getAllAnswer = async (req, res) => {
  const question_id = req.params.question_id;

  console.log("GET /answer/:question_id called for question:", question_id);

  try {
    const [results] = await db.promise().query(
      `SELECT 
        a.answer_id,
        a.answer,
        u.username,
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        a.created_at
      FROM answers a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.question_id = ?
      ORDER BY a.created_at ASC`,
      [question_id]
    );

    // Handle case where no answers are found
    if (results.length === 0) {
      return res.status(200).json({
        message: "No answers found for this question",
        answers: [],
        count: 0,
      });
    }

    res.status(200).json({
      message: "Answers retrieved successfully",
      answers: results,
      count: results.length,
    });
  } catch (error) {
    console.error("❌ Get answers error:", error.message);
    console.error("❌ SQL Error:", error.sqlMessage);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};
// Delete an answer
export const deleteAnswer = async (req, res) => {
  const userId = req.user.userid; // Get the logged-in user's ID
  const answerId = req.params.id; // Get the answer ID from the route

  try {
    const [answer] = await db.query(
      "SELECT userid FROM answers WHERE answerid = ?",
      [answerId]
    );

    if (answer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "Answer not found",
      });
    }

    if (answer[0].userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        msg: "You are not authorized to delete this answer",
      });
    }

    await db.query("DELETE FROM answers WHERE answerid = ?", [answerId]);

    res.status(StatusCodes.OK).json({ msg: "Answer deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
};
// Vote (like/dislike) an answer
export const voteAnswer = async (req, res) => {
  const userId = req.user.userid;
  const answerId = req.params.id;
  const { voteType } = req.body; // "upvote" or "downvote"

  if (!["upvote", "downvote"].includes(voteType)) {
    return res.status(400).json({ msg: "Invalid vote type" });
  }

  try {
    const [existingVote] = await db.query(
      "SELECT vote_type FROM answer_votes WHERE userid = ? AND answerid = ?",
      [userId, answerId]
    );

    if (existingVote.length > 0) {
      const currentVote = existingVote[0].vote_type;

      if (currentVote === voteType) {
        // User clicked the same vote again → remove it
        await db.query(
          "DELETE FROM answer_votes WHERE userid = ? AND answerid = ?",
          [userId, answerId]
        );

        const column = voteType === "upvote" ? "likes" : "dislikes";
        await db.query(
          `UPDATE answers SET ${column} = ${column} - 1 WHERE answerid = ?`,
          [answerId]
        );

        return res.status(200).json({ msg: `${voteType} removed` });
      } else {
        // User switched vote (upvote ⇄ downvote)
        await db.query(
          "UPDATE answer_votes SET vote_type = ? WHERE userid = ? AND answerid = ?",
          [voteType, userId, answerId]
        );

        const addColumn = voteType === "upvote" ? "likes" : "dislikes";
        const removeColumn = voteType === "upvote" ? "dislikes" : "likes";

        await db.query(
          `UPDATE answers SET ${addColumn} = ${addColumn} + 1, ${removeColumn} = ${removeColumn} - 1 WHERE answerid = ?`,
          [answerId]
        );

        return res.status(200).json({ msg: `Vote changed to ${voteType}` });
      }
    } else {
      // First time voting
      await db.query(
        "INSERT INTO answer_votes (userid, answerid, vote_type) VALUES (?, ?, ?)",
        [userId, answerId, voteType]
      );

      const column = voteType === "upvote" ? "likes" : "dislikes";
      await db.query(
        `UPDATE answers SET ${column} = ${column} + 1 WHERE answerid = ?`,
        [answerId]
      );

      return res.status(200).json({ msg: `${voteType} added` });
    }
  } catch (error) {
    console.error("Vote error:", error.message);
    return res.status(500).json({ msg: "Server error while voting" });
  }
};
// Edit an existing answer
export const editAnswer = async (req, res) => {
  const userId = req.user.userid; // Get the logged-in user's ID
  const answerId = req.params.id; // Get the answer ID from the route
  const { content } = req.body; // Get the new content for the answer

  if (!content || !content.trim()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Answer content cannot be empty",
    });
  }

  try {
    // Check if the answer exists and belongs to the logged-in user
    const [answer] = await db.query(
      "SELECT userid FROM answers WHERE answerid = ?",
      [answerId]
    );

    if (answer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "Answer not found",
      });
    }

    if (answer[0].userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        msg: "You are not authorized to edit this answer",
      });
    }

    // Update the answer content
    await db.query("UPDATE answers SET answer = ? WHERE answerid = ?", [
      content,
      answerId,
    ]);

    res.status(StatusCodes.OK).json({
      msg: "Answer updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
};

// Add a comment to an answer
export const addComment = async (req, res) => {
  const userId = req.user.userid; // Get the logged-in user's ID
  const answerId = req.params.answerId; // Get the answer ID from the route
  const { content } = req.body; // Get the comment content

  if (!content || !content.trim()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Comment content cannot be empty",
    });
  }

  try {
    await db.query(
      "INSERT INTO comments (answerid, userid, content) VALUES (?, ?, ?)",
      [answerId, userId, content]
    );

    res.status(StatusCodes.CREATED).json({
      msg: "Comment added successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
};

// Get all comments for an answer
export const getComments = async (req, res) => {
  const answerId = req.params.answerId; // Get the answer ID from the route

  try {
    const [comments] = await db.query(
      `SELECT 
        comments.commentid,
        comments.content,
        comments.created_at,
        users.username,
        users.userid
      FROM comments
      JOIN users ON comments.userid = users.userid
      WHERE comments.answerid = ?`,
      [answerId]
    );

    res.status(StatusCodes.OK).json({ comments });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const userId = req.user.userid; // Get the logged-in user's ID
  const commentId = req.params.commentId; // Get the comment ID from the route

  try {
    const [comment] = await db.query(
      "SELECT userid FROM comments WHERE commentid = ?",
      [commentId]
    );

    if (comment.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "Comment not found",
      });
    }

    if (comment[0].userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        msg: "You are not authorized to delete this comment",
      });
    }

    await db.query("DELETE FROM comments WHERE commentid = ?", [commentId]);

    res.status(StatusCodes.OK).json({ msg: "Comment deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
};
