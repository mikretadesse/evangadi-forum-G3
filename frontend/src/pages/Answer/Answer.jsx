import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Answer.css";
import { useAuth } from "../../context/AuthContext";
import api from "../../Api/axios";
import { toast } from "react-toastify";
import AnswerCard from "./AnswerCard";
import CommentBox from "../../components/Comments/CommentSection";
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
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 3;

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

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
    }
  };
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);

  const totalPages = Math.ceil(answers.length / answersPerPage);

  return (
    <div className="answer-container">
      {question && (
        <div className="question-card">
          <h2 className="title">QUESTION</h2>
          <h4>{question.title}</h4>
          <p>{question.description}</p>
          <Link to="/home" className="back-link">
            ← Back to Questions
          </Link>
        </div>
      )}
      <div>
        <h2>Answers from the evangadi community: ({answers.length})</h2>
      </div>
      {currentAnswers.map((ans) => (
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
      {answers.length > answersPerPage && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
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
