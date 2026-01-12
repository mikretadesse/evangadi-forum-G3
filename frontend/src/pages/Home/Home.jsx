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

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Fetch questions
  useEffect(() => {
    let isMounted = true;
    const fetchQuestions = async () => {
      try {
        // ✅ FIXED: Correct API endpoint for fetching all questions
        const res = await api.get("/question"); // must match backend route GET /api/question
        if (isMounted) setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Fetch questions error:", err);
        if (isMounted) setError("Failed to load questions.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchQuestions();
    return () => (isMounted = false);
  }, []);

  /* Format date */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter + Pagination
  const filteredQuestions = questions.filter((q) =>
    q.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__qbtn">
          <Link to="/ask-question">
            <button>Ask Question</button>
          </Link>
        </div>

        <div className="home__welcome">
          <h6>Welcome: {user?.name || user?.username || "User"}</h6>
        </div>
      </div>

      {/* Search bar */}
      <div className="search__container">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search__input"
        />
      </div>

      <div className="home__container">
        <h3>Questions</h3>
        <hr />

        {currentQuestions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          currentQuestions.map((item) => (
            <div key={item.question_id}> {/* ✅ FIXED: use question_id as key */}
              <div
                className="home__questions"
                onClick={() => navigate(`/answer/${item.question_id}`)}
              >
                <div>
                  <FaUserCircle style={{ fontSize: "60px" }} />
                  <div className="home__user mx-3">
                    {item.username || item.first_name || `User ${item.user_id}`}
                  </div>
                  <span className="answerDate">
                    {formatDate(item.created_at)}
                  </span>
                </div>

                <div className="home__question">{item.title}</div> {/* ✅ FIXED: use title instead of question or post_id */}
                <GrFormNext className="home__questionsArrow" />
              </div>
              <hr />
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)}>Prev</button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => goToPage(currentPage + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
