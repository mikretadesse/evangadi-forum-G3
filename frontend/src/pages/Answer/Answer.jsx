import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import "./Answer.css";
import { FaUserCircle } from "react-icons/fa";
import api from "../../Api/axios";
import CommentBox from "../../components/Comments/CommentSection";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function getTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
    { label: "second", secs: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.secs);
    if (count > 0) return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
  }
  return "just now";
}

const ANSWERS_PER_PAGE = 3;

const Answer = () => {
  const { question_id } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [votes, setVotes] = useState({});
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, [question_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
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
      fetchData();
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
                        onClick={() => saveEdit(ans.answer_id)}
                      >
                        Save
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                      >
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
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteAnswer(ans.answer_id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <div className="vote-box">
                        <button
                          className={`vote-btn up ${
                            userVotes[ans.answer_id] === "up" ? "active" : ""
                          }`}
                          onClick={() => handleVote(ans.answer_id, "up")}
                        >
                          👍 {vote.up}
                        </button>
                        <button
                          className={`vote-btn down ${
                            userVotes[ans.answer_id] === "down" ? "active" : ""
                          }`}
                          onClick={() => handleVote(ans.answer_id, "down")}
                        >
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
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
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

// return (
//   <div className="answer-container">
//     {question && (
//       <div className="question-card">
//         <span className="question-label">QUESTION</span>
//         <h2 className="question-title">{question.title}</h2>
//         <p className="question-description">{question.description}</p>
//       </div>
//     )}
//     {answers.map((ans) => {
//       const voteCount = votes[ans.answer_id] || { up: 0, down: 0 };
//       const isOwner = user?.username === ans.username;
//       const isEditing = editingId === ans.answer_id;

//       return (
//         <div key={ans.answer_id} className="answer-card">
//           <div className="answer-avatar">
//             <FaUserCircle className="user-icon" />
//             <span className="username">{ans.username}</span>
//           </div>
//           <div className="answer-content">
//             {isEditing ? (
//               <div>
//                 <textarea
//                   value={editText}
//                   onChange={(e) => setEditText(e.target.value)}
//                 />
//                 <div className="edit-actions">
//                   <button onClick={() => saveEdit(ans.answer_id)}>
//                     Save
//                   </button>
//                   <button onClick={cancelEdit}>Cancel</button>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <p className="answer-text">{ans.answer}</p>
//                 <div className="answer-actions">
//                   {isOwner && (
//                     <div>
//                       <button onClick={() => startEdit(ans)}>✏️ Edit</button>
//                       <button onClick={() => deleteAnswer(ans.answer_id)}>
//                         🗑 Delete
//                       </button>
//                     </div>
//                   )}
//                   <button onClick={() => handleVote(ans.answer_id, "up")}>
//                     👍 {voteCount.up}
//                   </button>
//                   <button onClick={() => handleVote(ans.answer_id, "down")}>
//                     👎 {voteCount.down}
//                   </button>
//                 </div>
//                 {ans.created_at && (
//                   <span className="answer-date">
//                     {new Date(ans.created_at).toLocaleString()}
//                   </span>
//                 )}
//                 <div className="comment-box-wrapper">
//                   <CommentBox answerid={ans.answer_id} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     })}
//     <div className="text-center mb-3">
//       <Link to="/home" className="text-decoration-none">
//         Go to question page
//       </Link>
//     </div>

//     <div className="answer-form">
//       <h4 className="form-title">Your Answer</h4>
//       <textarea
//         placeholder="Share your knowledge…"
//         value={newAnswer}
//         onChange={(e) => setNewAnswer(e.target.value)}
//       />
//       <div className="form-actions">
//         <button onClick={handlePostAnswer}>Post Answer</button>
//       </div>
//     </div>
//   </div>
// );
// };

// export default Answer;
