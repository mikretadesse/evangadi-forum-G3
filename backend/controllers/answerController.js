import { getQuestionById } from "../models/questionModel.js";
import { getAnswersByQuestion} from "../models/answerModel.js";
import { ApiError } from "../utils/apiError.js";

export const getAnswersByQuestionId = async (req, res, next) => {
  try {
    const { question_id } = req.params;

    // Validate question_id
    if (!question_id || isNaN(question_id)) {
      throw new ApiError(400, "Invalid question_id parameter (must be numeric)");
    }

    const qid = parseInt(question_id, 10);

    // Check if the question exists
    const question = await getQuestionById(qid);
    if (!question) {
      throw new ApiError(404, "The requested question could not be found.");
    }

    //  Fetch answers for that question
    const answers = await getAnswersByQuestion(qid);
if (answers.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No answers found for this question",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        question: {
          id: question.id,
          title: question.title,
          description: question.description,
        },
        answers: answers.map((answer) => ({
          answer_id: answer.id,
          content: answer.content,
          user_name: answer.user_name,
          created_at: answer.created_at,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching answers:", error.message);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.statusCode === 404 ? "Not Found" : "Bad Request",
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};