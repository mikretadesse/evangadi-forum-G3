import React, { useState, useEffect } from "react";
import styles from "./CommentBox.module.css";

const CommentBox = ({ answerid }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);

  // Load comments from server
  const loadComments = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/comments/${answerid}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.log("Error loading comments");
    }
  };

  // Load comments when box opens
  useEffect(() => {
    if (show) {
      loadComments();
    }
  }, [show]);

  // Post a new comment
  const handlePost = async () => {
    if (!text.trim()) {
      alert("Write a comment first!");
      return;
    }

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch("http://localhost:4000/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answerid: answerid,
          comment_body: text.trim(),
          userid: user?.id,
        }),
      });

      if (res.ok) {
        setText(""); // Clear text box
        loadComments(); // Refresh comments
      } else {
        alert("Could not post comment");
      }
    } catch (error) {
      alert("Check your internet connection");
    }
  };

  return (
    <div className={styles.container}>
      {/* Show/Hide button */}
      <button onClick={() => setShow(!show)} className={styles.btn}>
        {show ? "Hide" : "Comment"} ({comments.length})
      </button>

      {/* Show when button is clicked */}
      {show && (
        <div>
          {/* Text area to write comment */}
          <div className={styles.input}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your comment..."
              rows="2"
            />
            <button onClick={handlePost} className={styles.post}>
              Post
            </button>
          </div>

          {/* List of all comments */}
          <div className={styles.list}>
            {comments.map((c) => (
              <div key={c.comment_id} className={styles.item}>
                <p>{c.comment_body}</p>
                <small>By: {c.username || "User"}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentBox;
