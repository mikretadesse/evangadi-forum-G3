import "./Home.css";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GrFormNext } from "react-icons/gr";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../Api/axios";

const QUESTIONS_PER_PAGE = 5;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State variables
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [search, setSearch] = useState(""); 

  // Redirect if user not authenticated
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Fetch all questions from backend
  useEffect(() => {
    let isMounted = true; // prevent state update after unmount
    const fetchQuestions = async () => {
      try {
        const res = await api.get("/question"); 
        if (isMounted) setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Fetch questions error:", err);
        if (isMounted) setError("Failed to load questions.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchQuestions();
    return () => (isMounted = false); // cleanup
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter questions based on search
  const filteredQuestions = questions.filter((q) =>
    q.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  // Go to specific page
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

    // Delete question
  const deleteQuestion = async (e, question_id) => {
    e.stopPropagation(); // prevent navigation
    if (!window.confirm("Are you sure you want to delete this question?")) return;
  
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/question/${question_id}`, {
        headers: { Authorization: "Bearer " + token },
      });

      // Remove deleted question from state
      setQuestions((prev) => prev.filter((q) => q.question_id !== question_id));
      alert("Question deleted successfully");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error deleting question");
    }
  };
  


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home-container">
      {/* Welcome message */}
      <h4 className="wellcom_msg">
        Welcome: <span className="username">{user?.username}</span>
      </h4>

      {/* Ask Question Button */}
      <div className="ask-section">
        <Link to="/ask-question">
          <button className="ask-btn">Ask Question</button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search question"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {currentQuestions.length === 0 ? (
          <p>No questions found. Be the first one.</p>
        ) : (
          currentQuestions.map((item) => (
            <div
              key={item.question_id}
              className="question-item"
              onClick={() => navigate(`/answer/${item.question_id}`)}
              style={{ cursor: "pointer" }}
            >
              {/* Question content */}
              <div className="question-left">
                <div className="avatar"><FaUserCircle style={{ fontSize: "47px" }} /></div>
                <div>
                  <div className="question-text">{item.title}</div>
                  <div className="author">
                    {item.username} &nbsp;•&nbsp;
                    <span className="date">{formatDate(item.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Edit/Delete for owner only */}
              {item.user_id === user?.id && (
                <div className="question-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/EditQuestion/${item.question_id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => deleteQuestion(e, item.question_id)}
                  >
                    Delete
                  </button>
                </div>
              )}

              <GrFormNext className="arrow" />
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
