import api from "../../Api/axios";
import { toast } from "react-toastify";
const VoteEdit = ({
  answer_id,
  votes,
  isOwner,
  fetchData,
  editingId,
  editText,
  cancelEdit,
  startEdit,
}) => {
  const isEditing = editingId === answer_id;

  const handleVote = async (type) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/answer/vote/${answer_id}`,
        { voteType: type === "up" ? "upvote" : "downvote" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch {
      alert("Vote failed");
    }
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/answer/${answer_id}`,
        { answer: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      cancelEdit();
      fetchData();
      toast.success("Answer updated");
    } catch {
      alert("Update failed");
    }
  };

  const deleteAnswer = async () => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/answer/${answer_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      toast.success("Answer deleted");
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="answer-actions">
      {/* Voting */}
      <button className="vote-btn" onClick={() => handleVote("up")}>
        👍 {votes.up}
      </button>
      <button className="vote-btn" onClick={() => handleVote("down")}>
        👎 {votes.down}
      </button>

      {/* Owner actions */}
      {isOwner &&
        (isEditing ? (
          <div>
            <button className="edit-btn" onClick={saveEdit}>
              Save
            </button>
            <button className="delete-btn" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <button className="edit-btn" onClick={startEdit}>
              Edit
            </button>
            <button className="delete-btn" onClick={deleteAnswer}>
              Delete
            </button>
          </div>
        ))}
    </div>
  );
};

export default VoteEdit;
