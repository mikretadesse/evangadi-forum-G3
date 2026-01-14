import { useEffect, useState } from "react";
import { useParams, useNavigate, Link} from "react-router-dom";
import "./Answer.css";
import { FaUserCircle } from "react-icons/fa";
import api from "../../Api/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import CommentBox from "../../components/Comments/CommentSection";

const Answer = () => {
  const { question_id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [votes, setVotes] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const qRes = await api.get(`/question/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const aRes = await api.get(`/answer/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(qRes.data.question);
        setAnswers(aRes.data.answers || []);
        const initialVotes = {};
        (aRes.data.answers || []).forEach(
          (a) =>
            (initialVotes[a.answer_id] = {
              up: a.upvotes || 0,
              down: a.downvotes || 0,
            })
        );
        setVotes(initialVotes);
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [question_id]);

  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/answer/${question_id}`,
        { answer: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔁 REFRESH answers
      const res = await api.get(`/answer/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnswers(res.data.answers);
      setNewAnswer("");
      toast.success("Answer posted");
    } catch {
      toast.error("Failed to post answer");
    }
  };

  const handleVote = (answer_id, type) =>
    setVotes((prev) => {
      const v = prev[answer_id] || { up: 0, down: 0 };
      return {
        ...prev,
        [answer_id]: {
          up: type === "up" ? v.up + 1 : v.up,
          down: type === "down" ? v.down + 1 : v.down,
        },
      };
    });

  const startEdit = (ans) => {
    setEditingId(ans.answer_id);
    setEditText(ans.answer);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };
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
      toast.success("Answer updated");
    } catch {
      toast.error("Failed to update answer");
    }
  };

  const deleteAnswer = async (answer_id) => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/answer/${answer_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnswers((prev) => prev.filter((a) => a.answer_id !== answer_id));
      toast.success("Answer deleted");
    } catch {
      toast.error("Failed to delete answer");
    }
  };

  return (
    <div className="answer-container">
      {question && (
        <div className="question-card">
          <span className="question-label">QUESTION</span>
          <h2 className="question-title">{question.title}</h2>
          <p className="question-description">{question.description}</p>
        </div>
      )}
      {answers.map((ans) => {
        const voteCount = votes[ans.answer_id] || { up: 0, down: 0 };
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
                    <button onClick={() => handleVote(ans.answer_id, "up")}>
                      👍 {voteCount.up}
                    </button>
                    <button onClick={() => handleVote(ans.answer_id, "down")}>
                      👎 {voteCount.down}
                    </button>
                  </div>
                  {ans.created_at && (
                    <span className="answer-date">
                      {new Date(ans.created_at).toLocaleString()}
                    </span>
                  )}
                  <div className="comment-box-wrapper">
                    <CommentBox answerid={ans.answer_id} />
                  </div>
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

      <div className="answer-form">
        <h4 className="form-title">Your Answer</h4>
        <textarea
          placeholder="Share your knowledge…"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <div className="form-actions">
          <button onClick={handlePostAnswer}>Post Answer</button>
        </div>
      </div>
    </div>
  );
};

export default Answer;
