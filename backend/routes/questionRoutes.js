import express from "express";
import { getQuestionById } from "../controllers/questionController.js";

const router = express.Router();

router.get("/question/:question_id", getQuestionById);

export default router;
