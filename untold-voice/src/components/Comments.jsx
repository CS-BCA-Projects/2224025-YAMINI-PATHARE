import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Comments = ({ postId }) => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8000/api/comments/${postId}`)
      .then(({ data }) => setComments(data))
      .catch((err) => console.error(err));
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to comment.");
    
    try {
      const { data } = await axios.post(`http://localhost:8000/api/comments/${postId}`, { text }, { withCredentials: true });
      setComments([...comments, data]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.length === 0 ? <p>No comments yet.</p> : (
        comments.map((comment) => (
          <div key={comment._id} className="comment">
            <strong>{comment.author.username}</strong>
            <p>{comment.text}</p>
          </div>
        ))
      )}
      {user && (
        <form onSubmit={handleCommentSubmit}>
          <input type="text" placeholder="Write a comment..." value={text} onChange={(e) => setText(e.target.value)} required />
          <button type="submit">Post Comment</button>
        </form>
      )}
    </div>
  );
};

export default Comments;
