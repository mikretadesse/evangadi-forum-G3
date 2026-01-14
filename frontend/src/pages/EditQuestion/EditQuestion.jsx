import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../Api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./EditQuestion.module.css";

const EditQuestion = () => {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Track original values to detect changes
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch the question to prefill form
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/question/${question_id}`);
        const question = res.data.question;

        // Only allow owner to edit
        if (question.user_id !== user?.id) {
          toast.error("You are not allowed to edit this question");
          navigate("/");
          return;
        }

        setTitle(question.title);
        setDescription(question.description || "");

        // Save original values
        setOriginalTitle(question.title);
        setOriginalDescription(question.description || "");
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Failed to fetch question data");
        toast.error("Failed to fetch question data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [question_id, user, navigate]);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (updating) return;

    // Validate
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    // Detect no changes
    if (
      title.trim() === originalTitle.trim() &&
      description.trim() === originalDescription.trim()
    ) {
      toast.error("No changes made to the question");
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await api.patch(
        `/question/${question_id}`,
        { title, description },
        { headers: { Authorization: "Bearer " + token } }
      );

      toast.success("Question updated successfully", {
        onClose: () => navigate("/"),
        autoClose: 1500,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update question");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.message}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Question</h2>
      <form onSubmit={handleUpdate}>
        <label>Title:</label>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Question title"
        />

        <label>Description:</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Question description"
        />

        <button className={styles.updateBtn} type="submit" disabled={updating}>
          {updating ? "Updating..." : "Update Question"}
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
