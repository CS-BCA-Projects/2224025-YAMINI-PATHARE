import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url"; // Needed for __dirname in ES Modules

import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import postRoute from "./routes/post.js";  // Post Routes for Create, Edit, etc.
import commentRoute from "./routes/comments.js";
import commentModels from "./models/Comment.js";

// Define __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL, // ✅ Your frontend URL
    credentials: true, // ✅ Allow credentials (cookies, headers)
};
app.use(cors(corsOptions));
console.log("frontend url : ", process.env.FRONTEND_URL);
console.log("PORT:", process.env.PORT);
console.log("MONGO_URL:", process.env.MONGO_URL);

// Middleware
app.use(express.json());
app.use(cookieParser());



// Serve static images
app.use("/images", express.static(path.join(__dirname, "/images")));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);  // Use Post Routes
app.use('/api/comments', commentRoute);

// Upload Image (Optional, if needed for posts)
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, 'images');
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img);  // This is for image upload if needed in posts
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('img'), (req, res) => {
    res.status(200).json({ msg: 'File uploaded successfully' });
});

// Connect to MongoDB
const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
};

// Start Server AFTER Database Connects
const startServer = async () => {
    await ConnectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();




