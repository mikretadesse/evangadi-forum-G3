import express from "express";
import {getAnswersByQuestionId } from "../controllers/answerController.js";

const router = express.Router();

router.get("/answer/:question_id", getAnswersByQuestionId);

export default router;
