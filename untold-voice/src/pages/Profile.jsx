import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [blogsCount, setBlogsCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Backend se user ke blogs ka count fetch karna (Assuming API /api/user/blogs)
      fetch(`http://localhost:8000/api/user/blogs?userId=${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          setBlogsCount(data.count); // Assuming API returns { count: X }
        })
        .catch((err) => console.error("Error fetching blogs count:", err));
    }
  }, [user]);

  if (!user) {
    return <h2 className="text-center mt-5">Please login to view your profile.</h2>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👤 User Profile</h2>
      <div className="card shadow p-4">
        <h4>Name: {user.username}</h4>
        <p>Email: {user.email}</p>
        <p>Number of Blogs: {blogsCount}</p>
      </div>
    </div>
  );
};

export default Profile;
