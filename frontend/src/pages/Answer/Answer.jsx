import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
<<<<<<< HEAD
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../Api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Answer.css";
=======
import "./Answer.css";
import { useAuth } from "../../context/AuthContext";
import api from "../../Api/axios";
import { toast } from "react-toastify";
import AnswerCard from "./AnswerCard";
>>>>>>> main

const Answer = () => {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [votes, setVotes] = useState({});
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

<<<<<<< HEAD
  // Fetch question and answers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const qRes = await api.get(`/question/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(qRes.data.question);

        const aRes = await api.get(`/answer/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswers(aRes.data.answers || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      }
    };
=======
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data: qData } = await api.get(`/question/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data: aData } = await api.get(`/answer/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuestion(qData.question || null);
      setAnswers(aData.answers || []);
      const v = {};
      (aData.answers || []).forEach(
        (a) => (v[a.answer_id] = { up: a.likes || 0, down: a.dislikes || 0 })
      );
      setVotes(v);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
>>>>>>> main
    fetchData();
  }, [question_id]);

  // Post a new answer
  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/answer/${question_id}`,
        { answer: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
<<<<<<< HEAD

      const res = await api.get(`/answer/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(res.data.answers || []);
      setNewAnswer("");
      toast.success("Answer posted successfully");
    } catch (err) {
      console.error(err);
=======
      setNewAnswer("");
      fetchData();
      toast.success("Answer posted");
    } catch {
>>>>>>> main
      toast.error("Failed to post answer");
    }
  };

<<<<<<< HEAD
  // Vote handling (upvote/downvote)
  const handleVote = async (answer_id, type) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/answer/vote/${answer_id}`,
        { voteType: type === "up" ? "upvote" : "downvote" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic UI update
      setAnswers((prev) =>
        prev.map((a) => {
          if (a.answer_id !== answer_id) return a;

          let likes = a.likes;
          let dislikes = a.dislikes;
          let userVote = a.userVote || null;

          if (type === "up") {
            if (userVote === "upvote") {
              likes -= 1;
              userVote = null;
            } else if (userVote === "downvote") {
              dislikes -= 1;
              likes += 1;
              userVote = "upvote";
            } else {
              likes += 1;
              userVote = "upvote";
            }
          } else {
            if (userVote === "downvote") {
              dislikes -= 1;
              userVote = null;
            } else if (userVote === "upvote") {
              likes -= 1;
              dislikes += 1;
              userVote = "downvote";
            } else {
              dislikes += 1;
              userVote = "downvote";
            }
          }

          return { ...a, likes, dislikes, userVote };
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Voting failed");
    }
  };

  // Start editing
  const startEdit = (ans) => {
    setEditingId(ans.answer_id);
    setEditText(ans.answer);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Save edited answer
  const saveEdit = async (answer_id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/answer/${answer_id}`,
        { answer: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswers((prev) =>
        prev.map((a) =>
          a.answer_id === answer_id ? { ...a, answer: editText } : a
        )
      );
      cancelEdit();
      toast.success("Answer updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update answer");
    }
  };

  // Delete answer
  const deleteAnswer = async (answer_id) => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/answer/${answer_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnswers((prev) => prev.filter((a) => a.answer_id !== answer_id));
      toast.success("Answer deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete answer");
    }
  };

=======
>>>>>>> main
  return (
    <div className="answer-container">
      {/* Question Card */}
      {question && (
        <div className="question-card">
          <h2>{question.title}</h2>
          <p>{question.description}</p>
          <Link to="/home" className="back-link">
            ← Back to Questions
          </Link>
        </div>
      )}
<<<<<<< HEAD

      {/* Answers List */}
      {answers.map((ans) => {
        const isOwner = user?.username === ans.username;
        const isEditing = editingId === ans.answer_id;

        return (
          <div key={ans.answer_id} className="answer-card">
            <div className="answer-avatar">
              <FaUserCircle className="user-icon" />
              <span className="username">{ans.username}</span>
            </div>

            <div className="answer-content">
              {isEditing ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="edit-actions">
                    <button onClick={() => saveEdit(ans.answer_id)}>
                      Save
                    </button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="answer-text">{ans.answer}</p>

                  <div className="answer-actions">
                    {isOwner && (
                      <div>
                        <button onClick={() => startEdit(ans)}>✏️ Edit</button>
                        <button onClick={() => deleteAnswer(ans.answer_id)}>
                          🗑 Delete
                        </button>
                      </div>
                    )}
                    <button
                      className={ans.userVote === "upvote" ? "voted" : ""}
                      onClick={() => handleVote(ans.answer_id, "up")}
                    >
                      👍 {ans.likes}
                    </button>
                    <button
                      className={ans.userVote === "downvote" ? "voted" : ""}
                      onClick={() => handleVote(ans.answer_id, "down")}
                    >
                      👎 {ans.dislikes}
                    </button>
                  </div>

                  {ans.created_at && (
                    <span className="answer-date">
                      {new Date(ans.created_at).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="text-center mb-3">
        <Link to="/home" className="text-decoration-none">
          Go to question page
        </Link>
      </div>
=======

      {answers.map((ans) => (
        <AnswerCard
          key={ans.answer_id}
          ans={ans}
          votes={votes[ans.answer_id] || { up: 0, down: 0 }}
          user={user}
          editingId={editingId}
          setEditingId={setEditingId}
          editText={editText}
          setEditText={setEditText}
          fetchData={fetchData}
        />
      ))}
>>>>>>> main

      {/* New Answer Form */}
      <div className="answer-form">
        <h4 className="form-title">Your Answer</h4>
        <textarea
          placeholder="Share your knowledge…"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button onClick={handlePostAnswer}>Post Answer</button>
      </div>
    </div>
  );
};

export default Answer;
