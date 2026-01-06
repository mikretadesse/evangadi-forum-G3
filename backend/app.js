import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// Import routes
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

import passwordRoutes from "./routes/passwordRoutes.js";

dotenv.config();
const app = express();

// -----------Middleware------------//
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL, // allow your frontend
  credentials: true,                 // allow cookies if needed
}));
// ----------Routes--------------//
app.use("/api/user", authRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", passwordRoutes);


// ----------Default route----------//
app.get("/", (req, res) => {
  res.send("Evangadi Forum API is running...");
});

export default app;
