import "./CreatePost.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState(""); // ✅ Added content field
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/posts/create",
        {
          title,
          desc,
          content, // ✅ Ensure content is included
        },
        {
          withCredentials: true, // ✅ Important: This ensures cookies (token) are sent automatically
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Post Created:", data);
      navigate(`/post/${data._id}`);
    } catch (err) {
      console.error("Error creating post:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="header">Create a New Post</h2>
      <form className="post-form" onSubmit={handleSubmit}>
        <input
          className="input-box"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input-box"
          placeholder="Short Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <textarea
          className="input-box"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;
