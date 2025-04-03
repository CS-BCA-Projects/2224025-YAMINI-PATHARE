import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comments from "../components/Comments"; // Import the Comments component

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${id}`)
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch post");
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <div className="card shadow-lg p-4 border-0">
          {/* Blog Title */}
          <h1 className="text-primary text-center">{post.title}</h1>

          {/* Blog Image */}
          {post.photo && (
            <div className="text-center my-4">
              <img
                src={post.photo}
                alt="Blog Cover"
                className="img-fluid rounded shadow-lg"
                style={{ maxWidth: "600px", width: "100%" }}
              />
            </div>
          )}

          {/* Blog Meta */}
          <p className="text-muted text-center">
            By <strong>{post.userId?.username || "Unknown"}</strong> •{" "}
            {new Date(post.createdAt).toDateString()}
          </p>

          {/* Blog Description */}
          <p className="lead mt-3">{post.desc}</p>

          {/* Full Blog Content */}
          <div className="mt-4">
            <p style={{ textAlign: "justify", lineHeight: "1.8" }}>{post.content}</p>
          </div>

          {/* Comments Section */}
          <div className="mt-5">
            <Comments postId={id} />
          </div>

          {/* Back Button */}
          <div className="text-center mt-4">
            <a href="/myblogs" className="btn btn-outline-primary">
              ← Back to Blogs
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
