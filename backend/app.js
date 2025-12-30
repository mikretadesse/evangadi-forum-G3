import express from "express";
import dotenv from "dotenv";
// Initialize environment variables
dotenv.config();

import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";

const app = express();

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

//  check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Evangadi Forum API is running " });
});



export default app;