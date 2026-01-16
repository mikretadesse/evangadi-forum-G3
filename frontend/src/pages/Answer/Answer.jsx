import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Answer.css";
import { FaUserCircle } from "react-icons/fa";
import api from "../../Api/axios";
import CommentBox from "../../components/Comments/CommentSection";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const ANSWERS_PER_PAGE = 3;

const Answer = () => {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [votes, setVotes] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Format time
  const getTimeAgo = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d) ? "" : formatDistanceToNow(d, { addSuffix: true });
  };

  // Fetch question and answers
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [qRes, aRes] = await Promise.all([
          api.get(`/question/${question_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/answer/${question_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setQuestion(qRes.data.question);
        setAnswers(aRes.data.answers || []);

        const initialVotes = {};
        const initialUserVotes = {};

        (aRes.data.answers || []).forEach((a) => {
          initialVotes[a.answer_id] = {
            up: a.likes || 0,
            down: a.dislikes || 0,
          };
          initialUserVotes[a.answer_id] = a.user_vote || null;
        });

        setVotes(initialVotes);
        setUserVotes(initialUserVotes);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [question_id, user, navigate]);

  // Reset page when answers change
  useEffect(() => {
    setCurrentPage(1);
  }, [answers]);

  // Post new answer
  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
    setPosting(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/answer/${question_id}`,
        { answer: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await api.get(`/answer/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(res.data.answers || []);
      setNewAnswer("");
      toast.success("Answer posted");
    } catch {
      toast.error("Failed to post answer");
    } finally {
      setPosting(false);
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
      toast.success("Answer deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // Vote
  const handleVote = async (answer_id, type) => {
    try {
      const token = localStorage.getItem("token");
      const voteType = type === "up" ? "upvote" : "downvote";

      const res = await api.post(
        `/answer/vote/${answer_id}`,
        { voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVotes((prev) => {
        const current = prev[answer_id] || { up: 0, down: 0 };
        let { up, down } = current;

        if (res.data.msg === "Vote removed") type === "up" ? up-- : down--;
        if (res.data.msg === "Vote added") type === "up" ? up++ : down++;
        if (res.data.msg === "Vote switched")
          type === "up" ? (up++, down--) : (down++, up--);

        return {
          ...prev,
          [answer_id]: { up: Math.max(up, 0), down: Math.max(down, 0) },
        };
      });

      setUserVotes((prev) => ({
        ...prev,
        [answer_id]: res.data.msg === "Vote removed" ? null : type,
      }));
    } catch {
      toast.error("Voting failed");
    }
  };

  // Save edited answer
  const saveEdit = async (answer_id) => {
    if (!editText.trim()) return toast.error("Answer cannot be empty");

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
      setEditingId(null);
      setEditText("");
      toast.success("Answer updated");
    } catch {
      toast.error("Failed to update answer");
    }
  };

  // Pagination
  const totalPages = Math.ceil(answers.length / ANSWERS_PER_PAGE);
  const start = (currentPage - 1) * ANSWERS_PER_PAGE;
  const currentAnswers = answers.slice(start, start + ANSWERS_PER_PAGE);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="answer-container">
      {question && (
        <div className="question-box no-card">
          <h3>Question</h3>
          <h4>{question.title}</h4>
          <p>{question.description}</p>
        </div>
      )}

      <h3>Answers ({answers.length})</h3>

      <div className="answers-list">
        {currentAnswers.map((ans) => {
          const vote = votes[ans.answer_id] || { up: 0, down: 0 };
          const isOwner = ans.user_id === user.id;
          const isEditing = editingId === ans.answer_id;

          return (
            <div key={ans.answer_id} className="answer-card">
              <FaUserCircle className="user-icon" />

              <div className="answer-content">
                <strong>{ans.username}</strong>
                <span className="answer-time">
                  {getTimeAgo(ans.created_at)}
                </span>

                {isEditing ? (
                  <>
                    <textarea
                      className="edit-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="edit-actions">
                      <button
                        className="edit-btn"
                        onClick={() => saveEdit(ans.answer_id)}>
                        Save
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{ans.answer}</p>
                    <div className="answer-actions">
                      {isOwner && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setEditingId(ans.answer_id);
                              setEditText(ans.answer);
                            }}>
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteAnswer(ans.answer_id)}>
                            Delete
                          </button>
                        </>
                      )}
                      <div className="vote-box">
                        <button
                          className={`vote-btn up ${
                            userVotes[ans.answer_id] === "up" ? "active" : ""
                          }`}
                          onClick={() => handleVote(ans.answer_id, "up")}>
                          👍 {vote.up}
                        </button>
                        <button
                          className={`vote-btn down ${
                            userVotes[ans.answer_id] === "down" ? "active" : ""
                          }`}
                          onClick={() => handleVote(ans.answer_id, "down")}>
                          👎 {vote.down}
                        </button>
                      </div>
                    </div>
                    <div className="comment-box-wrapper">
                      <CommentBox answerid={ans.answer_id} />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      <div className="answer-form">
        <div className="text-center mb-3">
          <h2>Ask a Public Question</h2>
          <Link to="/home" className="subText">
            Go to question page
          </Link>
        </div>
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Your answer..."
        />
        <button onClick={handlePostAnswer} disabled={posting}>
          {posting ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </div>
  );
};

export default Answer;