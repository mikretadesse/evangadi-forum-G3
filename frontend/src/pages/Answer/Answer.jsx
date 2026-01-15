<<<<<<< HEAD
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Answer.css";
=======
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Answer.css";
import { FaUserCircle } from "react-icons/fa";
import api from "../../Api/axios";
import CommentBox from "../../components/Comments/CommentSection";
>>>>>>> a0941ca910337a2e2d2caa8f074edb0f3cfa656e
import { useAuth } from "../../context/AuthContext";
import api from "../../Api/axios";
import { toast } from "react-toastify";
<<<<<<< HEAD
import AnswerCard from "./AnswerCard";
import CommentBox from "../../components/Comments/CommentSection";
=======
import { formatDistanceToNow } from "date-fns";

const ANSWERS_PER_PAGE = 3;

>>>>>>> a0941ca910337a2e2d2caa8f074edb0f3cfa656e
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
  const [votes, setVotes] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [newAnswer, setNewAnswer] = useState("");
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
      setNewAnswer("");
      fetchData();
      toast.success("Answer posted");
    } catch {
      toast.error("Failed to post answer");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="answer-container">
      {question && (
        <div className="question-card">
          <h2 className="title">QUESTION</h2>
          <h3>{question.title}</h3>
          <p>{question.description}</p>
          <Link to="/home" className="back-link">
            ← Back to Questions
          </Link>
        </div>
      )}
      {answers.map((ans) => (
        <div key={ans.answer_id} className="answer-with-comments">
          <AnswerCard
            ans={ans}
            votes={votes[ans.answer_id] || { up: 0, down: 0 }}
            user={user}
            editingId={editingId}
            setEditingId={setEditingId}
            editText={editText}
            setEditText={setEditText}
            fetchData={fetchData}
          />
          <div className="comment-box-wrapper">
            <CommentBox answerid={ans.answer_id} />
          </div>
        </div>
      ))}

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
        <button onClick={handlePostAnswer}>Post Answer</button>
      </div>
    </div>
  );
};

export default Answer;