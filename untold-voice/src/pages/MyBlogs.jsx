import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

const MyBlogs = () => {
  const { user } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const options = {
          method: "GET",
          credentials: "include",
        };

        const myResponse = await fetch("http://localhost:8000/api/posts/myblogs", options);
        if (!myResponse.ok) throw new Error("Failed to fetch user blogs");
        const userBlogs = await myResponse.json();

        const response = await fetch("http://localhost:8000/api/posts", options);
        if (!response.ok) throw new Error("Failed to fetch all blogs");
        const allBlogs = await response.json();

        setMyBlogs(userBlogs);
        setBlogs(allBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-md-3 bg-white shadow-sm p-4">
          <h3 className="text-primary mb-4">Dashboard</h3>
          <ul className="list-group">
            <li className="list-group-item">
              <Link to="/myblogs/create" className="text-decoration-none text-primary">
                ➕ Create Post
              </Link>
            </li>
            <li className="list-group-item">
              <Link to="/myblogs/feministhistory" className="text-decoration-none text-primary">
                📜 Feminist History
              </Link>
            </li>
          </ul>
          <Link to="/login" className="btn btn-primary mt-4 w-100">
            ⬅ Back to Home
          </Link>
        </aside>

        {/* Main Content */}
        <main className="col-md-9 p-5">
          <h1 className="text-primary mb-4">My Blogs</h1>

          {loading ? (
            <p className="text-secondary">Loading blogs...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <>
              {/* User's Blogs */}
              <section>
                <h2 className="text-secondary mb-3">Your Blogs</h2>
                {myBlogs.length === 0 ? (
                  <p className="text-muted">You haven't written any blogs yet.</p>
                ) : (
                  <div className="row">
                    {myBlogs.map((blog) => (
                      <div key={blog._id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title text-primary">{blog.title}</h5>
                            <p className="card-text text-secondary">{blog.desc}</p>
                            <Link to={`/post/${blog._id}`} className="btn btn-outline-primary">
                              Read More →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Community Blogs */}
              <section className="mt-5">
                <h2 className="text-secondary mb-3">Community Blogs</h2>
                {blogs.length === 0 ? (
                  <p className="text-muted">No blogs from other users yet.</p>
                ) : (
                  <div className="row">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title text-primary">{blog.title}</h5>
                            <p className="card-text text-secondary">{blog.desc}</p>
                            <p className="card-text">
                              <small className="text-muted">By: {blog.userId?.username || "Unknown"}</small>
                            </p>
                            <Link to={`/post/${blog._id}`} className="btn btn-outline-primary">
                              Read More →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyBlogs;
