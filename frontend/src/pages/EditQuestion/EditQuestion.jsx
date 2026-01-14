import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../Api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./EditQuestion.module.css";

const EditQuestion = () => {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Original values for change detection
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");

  useEffect(() => {
    if (!user) navigate("/");

    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/question/${question_id}`);
        const question = res.data.question;

        if (question.user_id !== user?.id) {
          toast.error("You are not allowed to edit this question");
          navigate("/home");
          return;
        }

        setTitle(question.title);
        setDescription(question.description || "");
        setOriginalTitle(question.title);
        setOriginalDescription(question.description || "");
      } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error("Failed to fetch question data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [question_id, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (updating) return;

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (
      title.trim() === originalTitle.trim() &&
      description.trim() === originalDescription.trim()
    ) {
      toast.error("No changes made to the question");
      return;
    }

    try {
      setUpdating(true);
      await toast.promise(
        api.patch(
          `/question/${question_id}`,
          { title: title.trim(), description: description.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        {
          pending: "Updating your question...",
          success: "Question updated successfully!",
          error: "Failed to update question.",
        }
      );
      navigate("/home");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update question");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className={styles.message}>Loading...</p>;

  return (
    <div className={styles.pageWrapper}>
      {/* Editing Tips Card on top */}
      <div className={styles.stepsHorizontal}>
        <h2>Tips for Editing Your Question</h2>
        <div className={styles.stepsList}>
          <div className={styles.stepItem}>
            Update the title to clearly summarize your problem.
          </div>
          <div className={styles.stepItem}>
            Refine the description with additional details or clarifications.
          </div>
          <div className={styles.stepItem}>
            Include what you tried or any unexpected outcomes.
          </div>
          <div className={styles.stepItem}>
            Keep your question concise, clear, and easy to understand.
          </div>
        </div>
      </div>

      {/* Edit Form below */}
      <div className={styles.formSection}>
        <h2>Edit Your Question</h2>

        <form onSubmit={handleUpdate}>
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

          <button type="submit" disabled={updating}>
            {updating ? "Updating..." : "Update Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQuestion;
