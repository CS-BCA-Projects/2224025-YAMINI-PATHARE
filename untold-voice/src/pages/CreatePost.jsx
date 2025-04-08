import "../styles/CreatePost.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", "Personal Stories", "History", "Equality", "Racism", "Kind", "Sad", "Other"];

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

      toast.success("🎉 Post Created Successfully!", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
      });

      setTimeout(() => {
        navigate(`/post/${data.post._id}`);
      }, 3500);
    } catch (err) {
      toast.error("🚫 Error Creating Post", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
      });
      console.error("Error creating post:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="create-post-page">
      {/* Background Video */}
      <div className="video-container">
        <video autoPlay loop muted>
          <source src="/New.mp4" type="video/mp4" />
          Your browser does not support the video tag.
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

      {/* Toast Notification */}
      <ToastContainer />
    </div>
  );
};

export default CreatePost;
