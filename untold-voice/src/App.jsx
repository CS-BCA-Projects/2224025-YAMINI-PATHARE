import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import MyBlogs from "./pages/MyBlogs";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Feministhistory from "./pages/Feministhistory";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostDetails />} />
        

        {/* Nested Routing for MyBlogs */}
        <Route path="/myblogs/*" element={<MyBlogs />} />
        <Route path="/myblogs/create" element={<CreatePost />} />
        <Route path="/myblogs/edit" element={<EditPost />} />
        <Route path="/myblogs/feministhistory" element={<Feministhistory />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

