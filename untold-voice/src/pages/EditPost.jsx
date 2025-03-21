import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPost = () => {
  const { id } = useParams(); // ✅ Extract postId from URL
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    desc: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch post details when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/posts/${id}`, {
          withCredentials: true,
        });
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // ✅ Handle post update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8000/api/posts/${id}`,
        post,
        { withCredentials: true }
      );

      navigate("/myblogs"); // ✅ Redirect to MyBlogs page after update
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post");
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={post.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="desc"
          placeholder="Description"
          value={post.desc}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Write your content here..."
          value={post.content}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
