import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./MyHome.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/posts", {
          withCredentials: true, // ✅ Ensure authentication cookies are sent
        });
        setPosts(data);
      } catch (err) {
        setError("Failed to fetch posts. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section with Background Video */}
      <header className="hero">
        <video autoPlay loop muted className="hero-video">
          <source src="/empowerment.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
        >
          <h2>BLOGS: Empowering Voices, Telling Stories</h2>
          <p>Discover untold stories of women from around the world.</p>
          <Link to="/register" className="btn-primary">Join Us</Link>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="features">
        <motion.div 
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src="/story.avif" alt="Storytelling" />
          <h3>Share Your Story</h3>
          <p>Create blogs and inspire others.</p>
        </motion.div>

        <motion.div 
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src="/feminismdraw.jpg" alt="Feminist History" />
          <h3>Feminist History</h3>
          <p>Explore influential figures and movements.</p>
        </motion.div>

        <motion.div 
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src="/community.jpg" alt="Community" />
          <h3>Join the Community</h3>
          <p>Engage with like-minded individuals.</p>
        </motion.div>
      </section>

      {/* Blog Posts Section */}
      <section className="blog-section">
        <h2>Latest Blogs</h2>
        {loading ? (
          <p>Loading blogs...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="blog-grid">
            {posts.length === 0 ? (
              <p>No blogs available. Be the first to share your story!</p>
            ) : (
              posts.map((post) => (
                <motion.div 
                  key={post._id} 
                  className="blog-card"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>{post.title}</h3>
                  <p>{post.desc}</p>
                  <Link to={`/post/${post._id}`} className="read-more">
                   Read More
                  </Link>

                  
                </motion.div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
