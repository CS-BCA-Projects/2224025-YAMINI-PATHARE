import express from "express";
import Post from "../models/Post.js";
import verifyToken from "../verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Create Post
router.post("/create", verifyToken, async (req, res) => {
    console.log("I am here")
    try {
        const { title, desc, content } = req.body;

        if (!title || !desc || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(req.user.id); // ✅ Use req.user.id from verifyToken.js
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newPost = new Post({
            title,
            desc,
            content,
            author: user.username, // ✅ Set author from logged-in user
            userId: user._id, // ✅ Assign userId automatically
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Fetch all blogs (user's and others)
router.get("/", verifyToken, async (req, res) => {
    console.log("I am here")
    try {
        const posts = await Post.find().populate("userId");
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Fetch only the logged-in user's blogs
router.get("/myblogs", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Corrected from req.user._id

        const userPosts = await Post.find({ userId }).populate("userId");
        res.status(200).json(userPosts);
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        res.status(500).json({ message: "Error fetching your blogs" });
    }
});

// GET a single blog post by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("userId", "username");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Update Post
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.userId.toString() !== req.user.id) { // ✅ Fixed from req.userID
            return res.status(403).json({ message: "Unauthorized to update this post" });
        }

        post.title = req.body.title || post.title;
        post.desc = req.body.desc || post.desc;

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ Delete Post
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.userId.toString() !== req.user.id) { // ✅ Fixed from req.userID
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: err.message });
    }
});

export default router;
