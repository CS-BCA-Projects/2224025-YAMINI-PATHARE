import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // ✅ Read token from cookies

  if (!token) {
    return res.status(401).json({ message: "No token found, please login again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET); // ✅ Ensure correct env variable
    req.user = decoded; // ✅ Store entire user object
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default verifyToken;
