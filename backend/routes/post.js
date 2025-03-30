import express from "express";
import Post from "../models/Post.js";
import verifyToken from "../verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Create Post
router.post("/create", verifyToken, async (req, res) => {
    try {
        const { title, desc, content, category } = req.body;

        if (!title || !desc || !content || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newPost = new Post({
            title,
            desc,
            content,
            category,
            author: user.username,
            userId: user._id,
        });

        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Fetch all blogs
router.get("/",  async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};
    
        if (search) {
          query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }
    
        if (category) {
          query.category = category; // Exact category match
        }
        const posts = await Post.find().populate("userId", "username");
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Fetch only logged-in user's blogs
router.get("/myblogs", verifyToken, async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.user.id }).populate("userId", "username");
        res.status(200).json(userPosts);
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        res.status(500).json({ message: "Error fetching your blogs" });
    }
});

// ✅ Fetch a single blog post by ID
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


// ✅ Delete Post
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
