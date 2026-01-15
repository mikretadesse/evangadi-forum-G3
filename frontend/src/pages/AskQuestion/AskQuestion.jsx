import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AskQuestion.module.css";
import api from "../../Api/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posting, setPosting] = useState(false);

  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Prevent rendering if user is not logged in
  if (!user) return null;

  // Submit Question
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title, description are required.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
    };

    try {
      await toast.promise(
        api.post("/question", payload, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          pending: "Posting your question...",
          success: "Question posted successfully!",
          error: "Failed to post question. Please try again.",
        }
      );

      // Reset form fields after successful submission
      setTitle("");
      setDescription("");

      // Redirect user to home page after a short delay
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      // Display server-side or generic error message
      setError(error.response?.data?.message || "Failed to post question.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Instruction / Tips Card */}
      <div className={styles.stepsHorizontal}>
        <h2>Steps to Write a Good Question</h2>
        <div className={styles.stepsList}>
          <div className={styles.stepItem}>
            Summarize your problem in a one-line title.
          </div>
          <div className={styles.stepItem}>
            Describe your problem in detail.
          </div>
          <div className={styles.stepItem}>
            Explain what you tried and what you expected.
          </div>
          <div className={styles.stepItem}>
            Review your question before posting.
          </div>
        </div>
      </div>

      {/* Question Form */}
      <div className={styles.formSection}>
        <h2>Ask a Public Question</h2>
        <Link to="/home" className={styles.subText}>
          Go to Home page
        </Link>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            maxLength={200}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Question Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" disabled={posting}>
            {posting ? "Posting..." : "Post Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;

/**
 * Handles question submission
 * - Validates input fields
 * - Sends POST request to backend
 * - Shows toast notifications
 * - Redirects user on success
 */
