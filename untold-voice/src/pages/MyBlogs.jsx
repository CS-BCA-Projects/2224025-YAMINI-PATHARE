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
  const [category, setCategory] = useState("All");
  const categories = ["All", "Personal Stories", "History", "Equality", "Racism", "Kind", "Sad","other"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const options = {
          method: "GET",
          credentials: "include",
        };

        const myResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/myblogs`, options);
        if (!myResponse.ok) throw new Error("Failed to fetch user blogs");
        const userBlogs = await myResponse.json();

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, options);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setMyBlogs(myBlogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog. Please try again.");
    }
  };

  // ✅ Filter blogs based on category selection
  const filteredBlogs =
    category === "All" ? blogs : blogs.filter((blog) => blog.category === category);

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
                            <div className="d-flex justify-content-between">
                              <Link to={`/post/${blog._id}`} className="btn btn-outline-primary">
                                Read More →
                              </Link>
                              <button className="btn btn-danger" onClick={() => handleDelete(blog._id)}>
                                🗑 Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Select Category */}
              <div className="mb-4">
                <label className="form-label">Filter by Category:</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Community Blogs */}
              <section className="mt-5">
                <h2 className="text-secondary mb-3">Community Blogs</h2>

                {filteredBlogs.length === 0 ? (
                  <p className="text-muted">No blogs available in this category.</p>
                ) : (
                  <div className="row">
                    {filteredBlogs.map((blog) => (
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
