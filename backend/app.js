import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// Import routes
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
dotenv.config();
const app = express();
app.use(cors());

// -----------Middleware------------//
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ----------Routes--------------//
app.use("/api/user", authRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/notifications", notificationRoutes);
// ----------Default route----------//
app.get("/", (req, res) => {
  res.send("Evangadi Forum API is running...");
});

export default app;
