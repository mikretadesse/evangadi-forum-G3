import express from "express";
import { voteAnswer } from "../controllers/VoteController.js";
import {
  postAnswer,
  getAllAnswer,
  deleteAnswer,
  editAnswer,
  addComment,
  getComments,
  deleteComment,
} from "../controllers/answerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
/**
 * POST /api/answer
 * Protected route
 */

router.post("/vote/:answer_id", authenticateToken, voteAnswer);
router.delete("/:answer_id", authenticateToken, deleteAnswer);
router.put("/:answer_id", authenticateToken, editAnswer);

router.post("/:question_id", authenticateToken, postAnswer);
router.get("/:question_id", getAllAnswer);

router.post("/comment/:answer_id", authenticateToken, addComment);
router.get("/comment/:answer_id", getComments);
router.delete("/comment/:comment_id", authenticateToken, deleteComment);

export default router;
