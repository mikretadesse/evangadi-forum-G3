import { getQuestionById as findQuestionById } from "../models/questionModel.js";
import { ApiError } from "../utils/apiError.js";

export const getQuestionById = async (req, res, next) => {
  try {
    const { question_id } = req.params;

    // Convert to integer and validate
    const id = parseInt(question_id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question_id (must be a number)",
      });
    }

    // Use your MySQL model function (from questionModel.js)
    const question = await findQuestionById(id);

    if (!question) {
      throw new ApiError(404, "Question not found");
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Error getting question:", error.message);
    next(error);
  }
};
