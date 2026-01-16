import React, { useState, useEffect, useCallback } from "react";
import styles from "./CommentBox.module.css";
import { useAuth } from "../../context/AuthContext";
import api from "../../Api/axios";
import { toast } from "react-toastify";

const CommentBox = ({ answerid }) => {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load comments for this answer
  const loadComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments/${answerid}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error(
        "Failed to load comments:",
        error.response?.data || error.message
      );
      toast.error("Failed to load comments");
    }
  }, [answerid]);

  // Load comments only when comment box is opened
  useEffect(() => {
    if (show) loadComments();
  }, [show, loadComments]);

  // Post a new comment
  const handlePost = async () => {
    if (!text.trim()) {
      toast.warning("Please write a comment first");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      setLoading(true);

      // Post to backend (userid is removed; backend uses JWT)
      await api.post("/comments", {
        answerid,
        comment_body: text.trim(),
      });

      setText(""); // clear input
      await loadComments(); // refresh comments
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error(
        "Failed to post comment:",
        error.response?.data || error.message
      );
      toast.error("Unable to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Toggle comment box */}
      <button className={styles.btn} onClick={() => setShow((prev) => !prev)}>
        {show ? "Hide Comments" : "Comment"} ({comments.length})
      </button>

      {show && (
        <>
          {/* Input area */}
          <div className={styles.input}>
            <textarea
              rows="2"
              placeholder="Type your comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className={styles.post}
              onClick={handlePost}
              disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {/* Comment list */}
          <div className={styles.list}>
            {comments.length === 0 ? (
              <p className={styles.empty}>No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.comment_id} className={styles.item}>
                  <p>{comment.comment_body}</p>
                  <small>By: {comment.username || "Anonymous"}</small>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentBox;
