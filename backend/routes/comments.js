import express from "express";
import Comment from "../models/Comment.js"; // ✅ Correct

import verifyToken from "../verifyToken.js";

const router = express.Router();

// Get comments for a specific post with user details
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "username email") // Populating user details (username & email)
      .sort({ createdAt: -1 }); // Sorting comments by latest first

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }

    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});


// Add a new comment
router.post("/:postId", verifyToken, async (req, res) => {
  try {
    // Ensure comment text is provided
    if (!req.body.text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Create and save the new comment
    const newComment = new Comment({
      Comment: req.body.text,
      postId: req.params.postId,
      userId: req.user.id,
    });

    const savedComment = await newComment.save();

    // Populate user details (username, email) before sending response
    const populatedComment = await Comment.findById(savedComment._id).populate("userId", "username email");

    console.log("New comment added:", populatedComment);
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;