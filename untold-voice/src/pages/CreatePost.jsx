import "../styles/CreatePost.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("All","Personal Stories","History", "Equality", "Racism", "Kind", "Sad","other"); // ✅ Move inside the component
  const navigate = useNavigate();
  
  const categories = ["All","Personal Stories", "History", "Equality", "Racism", "Kind", "Sad","other"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/create`,
        { title, desc, content, category },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Post Created:", data);
      navigate(`/post/${data.post._id}`);
    } catch (err) {
      console.error("Error creating post:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      {/* Background Video */}
      <div className="video-container">
        <video autoPlay loop muted>
          <source src="/New.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Create Post Form */}
      <div className="create-post-container">
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Short Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
