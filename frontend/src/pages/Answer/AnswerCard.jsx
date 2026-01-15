import { FaUserCircle } from "react-icons/fa";
import VoteEdit from "../../components/vote/Votedit";
const AnswerCard = ({
  ans,
  votes,
  user,
  editingId,
  setEditingId,
  editText,
  setEditText,
  fetchData,
}) => {
  const isOwner = user?.username === ans.username;
  const isEditing = editingId === ans.answer_id;

  // start editing → set editText to current answer
  const startEdit = () => {
    setEditingId(ans.answer_id);
    setEditText(ans.answer); // 💡 Prefill textarea with previous answer
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="answer-card">
      <div className="answer-header">
        <div className="user-badge">
          <FaUserCircle className="user-icon" />
          <span className="username">{ans.username}</span>
        </div>
        <span className="answer-date">
          {new Date(ans.created_at).toLocaleString()}
        </span>
      </div>
      {/* Show previous answer in textarea if editing, otherwise show answer */}
      {isEditing ? (
        <div className="edit-mode">
          <textarea
            value={editText} // 💡 Prefilled with previous answer
            onChange={(e) => setEditText(e.target.value)}
          />
        </div>
      ) : (
        <p className="answer-text">{ans.answer}</p>
      )}
      <VoteEdit
        answer_id={ans.answer_id}
        votes={votes}
        isOwner={isOwner}
        fetchData={fetchData}
        editingId={editingId}
        setEditingId={setEditingId}
        editText={editText}
        setEditText={setEditText}
        cancelEdit={cancelEdit}
        startEdit={startEdit} // pass startEdit so VoteEdit can trigger
      />
    </div>
  );
};
export default AnswerCard;
