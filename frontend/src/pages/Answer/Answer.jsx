
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import api from "../../Api/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import CommentBox from "../../components/Comments/CommentSection";

const Answer = () => {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [question, setQuestion] = useState({});
  const [answerText, setAnswerText] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await api.get(`/question/${question_id}`);
      setQuestion(res.data.question || res.data.data);
    };
    fetchQuestion();
  }, [question_id]);
  useEffect(() => {
    const fetchAnswers = async () => {
      const res = await api.get(`/answer/${question_id}`);
      setAnswers(res.data.answers || res.data.data || []);
    };
    fetchAnswers();
  }, [question_id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return toast.error("Answer cannot be empty");

    try {
      await api.post(
        `/answer/${question_id}`,
        { answer: answerText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Answer posted successfully!");
      setAnswerText("");

      const res = await api.get(`/answer/${question_id}`);
      setAnswers(res.data.answers || res.data.data || []);
    } catch {
      toast.error("Failed to post answer");
    }
  };

  return (
    <div className="container my-4">
      {/* Question */}
      <div className=" pb-2">
        <h3>Question</h3>
        <div className="fw-semibold text-start ">{question?.title}</div>
        <div className="text-muted">{question?.description}</div>
      </div>

      {/* Answers */}
      <h4 className=" border-bottom py-2 border-top  ">
        Answer From The Community
      </h4>

      {answers.map((item) => (
        <div key={item.answer_id} className="mb-4">
          <div className="d-flex gap-3 border-bottom ms-auto ">
            <div className="d-flex py-1 flex-column gap-1">
              <FaUserCircle size={45} className="text-secondary" />
              <small className="fw-semibold">
                {item.username || item.first_name}
              </small>
            </div>
            <div className="w-100 ">
              <div className="bg-light rounded p-1 mt-1">
                {item.answer_body || item.answer}
              </div>
            </div>
          </div>

          <CommentBox answerid={item.answer_id} />
        </div>
      ))}

      {/* Answer Form */}
      <div className="card shadow-sm mt-5">
        <div className="card-body">
          <h5 className="text-center fw-bold mb-3">Answer The Top Question</h5>

          <div className="text-center mb-3">
            <Link to="/home" className="text-decoration-none">
              Go to question page
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control mb-3"
              rows="6"
              placeholder="Your Answer here"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />

            <div className="buttonRow  d-md-flex justify-content-md-center">
              <button className="btn btn-primary px-4" type="submit">
                Post Your Answer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Answer;
