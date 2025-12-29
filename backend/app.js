
import dotenv from "dotenv";
// Initialize environment variables
dotenv.config();

import express from "express";
import db from "./config/database.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";

const app = express();

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Test Database Connection (pool already tested at import)
// Optionally verify models’ tables exist on startup
import { initializeUserTable } from "./models/userModel.js";
import { initializeQuestionTable } from "./models/questionModel.js";
import { initializeAnswerTable } from "./models/answerModel.js";

(async () => {
  try {
    await initializeUserTable();
    await initializeQuestionTable();
    await initializeAnswerTable();
    console.log("All database tables are ready.");
  } catch (err) {
    console.error(" Failed to initialize tables:", err.message);
    process.exit(1);
  }
})();

// Routes
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

//  check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Evangadi Forum API is running " });
});

//  Error handling middleware
app.use((err, req, res, next) => {
  console.error(" Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    message: err.message || "An unexpected error occurred",
  });
});

export default app;