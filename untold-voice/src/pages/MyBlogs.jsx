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
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);

  const categories = [
    "All",
    "Personal Stories",
    "History",
    "Equality",
    "Racism",
    "Kind",
    "Sad",
    "other"
  ];

  // Fetch blogs and member list
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const myResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/myblogs`, options);
        const userBlogs = await myResponse.json();

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, options);
        const allBlogs = await response.json();

        const memberResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/community/members`, options);
        const memberData = await memberResponse.json();

        setMyBlogs(userBlogs);
        setBlogs(allBlogs);
        setMembers(memberData);

        const alreadyJoined = memberData.some((m) => m.userId?.email === user?.email);
        setJoined(alreadyJoined);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${id}`, {
        method: "DELETE",
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

  const handleJoin = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/community/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?._id,
          name: user?.username,
          email: user?.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setJoined(true);
        setMembers((prev) => [...prev, { userId: { _id: user._id, username: user.username, email: user.email } }]);
        alert("Successfully joined the community!");
      } else {
        alert(data.message || "Failed to join.");
      }
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const filteredBlogs =
    category === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === category);

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

          {/* Join Community Section */}
          <div className="mt-4 p-3 bg-light border rounded text-center">
            {joined ? (
              <p className="text-success">🌟 You are part of the community!</p>
            ) : (
              <>
                <p className="text-muted">Want to be part of our vibrant space?</p>
                <button
                  onClick={handleJoin}
                  className="btn btn-pink w-100 text-white"
                  style={{ backgroundColor: "#d63384" }}
                >
                  💜 Join Our Community
                </button>
              </>
            )}
          </div>

          {/* Community Members */}
          <div className="mt-4">
            <h5 className="text-primary">👥 Community Members</h5>
            {Array.isArray(members) ? (
              <ul className="list-group small">
                {members.map((member) => (
                  <li key={member._id} className="list-group-item">
                    {member.userId?.username || "Unknown"} <br />
                    <small className="text-muted">{member.userId?.email || "No email"}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No members found or error fetching data.</p>
            )}
          </div>
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

              {/* Category Filter */}
              <div className="mb-4">
                <label className="form-label">Filter by Category:</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
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
                              <small className="text-muted">
                                By: {blog.userId?.username || "Unknown"}
                              </small>
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
