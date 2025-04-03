import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Comments = ({ postId }) => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/comments/${postId}`);
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to comment.");

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/comments/${postId}`,
        { text },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setComments([data, ...comments]); // Add new comment at the top
      setText("");
    } catch (err) {
      console.error("Error posting comment:", err.response?.data || err.message);
      alert("Failed to post comment. Please try again.");
    }
  };

  return (
    <div className="mt-5">
      <h3 className="text-primary">Comments</h3>

      {/* Loading State */}
      {loading && <p className="text-muted">Loading comments...</p>}

      {/* Error Message */}
      {error && <p className="text-danger">{error}</p>}

      {/* Comments List */}
      {!loading && !error && (
        <div className="list-group mt-3">
          {comments.length === 0 ? (
            <p className="text-muted">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="list-group-item list-group-item-action d-flex align-items-start border-0 shadow-sm p-3 mb-2 rounded"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="me-3">
                  <span
                    className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center"
                    style={{ width: "40px", height: "40px", fontSize: "1rem" }}
                  >
                    {comment?.userId?.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-grow-1">
                  <strong className="text-dark">
                    {comment?.userId?.username || "Unknown User"}
                  </strong>
                  <p className="mb-1">{comment?.text}</p>
                  <small className="text-muted">
                    {comment?.createdAt ? new Date(comment.createdAt).toLocaleString() : "Unknown time"}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Comment Input */}
      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Comments;
