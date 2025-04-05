import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="container-fluid p-0 text-center text-white" style={{ background: "linear-gradient(135deg, #8e44ad, #f39c12)", minHeight: "100vh" }}>
      
      {/* Hero Section */}
      <header className="position-relative d-flex align-items-center justify-content-center" style={{ height: "500px", overflow: "hidden" }}>
        <video autoPlay loop muted className="position-absolute w-100 h-100 object-fit-cover" style={{ zIndex: -1 }}>
          <source src="/empowerment.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <motion.div 
          className="bg-dark bg-opacity-50 p-4 rounded w-75"
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
        >
          <h2>BLOGS: Empowering Voices, Telling Stories</h2>
          <p>Discover untold stories of women from around the world.</p>
          <Link to="/register" className="btn btn-light fw-bold px-4">Join Us</Link>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="container my-5">
        <div className="row justify-content-center g-4">
          {/* Card 1 */}
          <motion.div 
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card h-100 shadow-sm">
              <img src="/story.avif" className="card-img-top" alt="Storytelling" style={{ height: "150px", objectFit: "cover" }} />
              <div className="card-body">
                <h5 className="card-title">Share Your Story</h5>
                <p className="card-text">Create blogs and inspire others.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card h-100 shadow-sm">
              <img src="/feminismdraw.jpg" className="card-img-top" alt="Feminist History" style={{ height: "150px", objectFit: "cover" }} />
              <div className="card-body">
                <h5 className="card-title">Feminist History</h5>
                <p className="card-text">Explore influential figures and movements.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card h-100 shadow-sm">
              <img src="/community.jpg" className="card-img-top" alt="Community" style={{ height: "150px", objectFit: "cover" }} />
              <div className="card-body">
                <h5 className="card-title">Join the Community</h5>
                <p className="card-text">Engage with like-minded individuals.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
