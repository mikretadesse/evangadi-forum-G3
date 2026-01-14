import { StatusCodes } from "http-status-codes";
import {
  createComment,
  getCommentsByAnswer,
  
} from "../models/commentModel.js";

export const postComment = async (req, res) => {
  try {
    // 1. Get data from request body
    const { answerid, comment_body } = req.body;

    // 2. Get user id from authMiddleware (JWT)
    // const { userid } = req.user;
    const userid = req.body.userid || (req.user ? req.user.userid : null);
    // console.log(" POST /api/comments called");
    // console.log("Request body:", req.body);
    // console.log("Request user:", req.user);

    // 3. Validation
    if (!answerid || !comment_body) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide answer ID and comment text",
      });
    }

    // 4. Insert comment into database
    await createComment(answerid, userid, comment_body);

    // 5. Success response
    return res.status(StatusCodes.CREATED).json({
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Post Comment Error:", error);

    // 6. Server error
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

/**
 * GET /api/comments/:answerid
 * Description: Get all comments for an answer
 */
export const getComments = async (req, res) => {
  try {
    const { answerid } = req.params;

    // 1. Get comments from database
    const comments = await getCommentsByAnswer(answerid);

    // 2. Success response
    return res.status(StatusCodes.OK).json({
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};
