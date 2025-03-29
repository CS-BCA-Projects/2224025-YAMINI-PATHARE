import express from "express";
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import verifyToken from "../verifyToken.js";

const router = express.Router();

/** 
 * ✅ Get comments for a specific post with user details
 * @route GET /api/comments/:postId
 */
router.get("/:postId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "username email") // ✅ Populating user details
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * ✅ Add a new comment
 * @route POST /api/comments/:postId
 */
router.post("/:postId", verifyToken, async (req, res) => {
  try {
    console.log("User from token:", req.user);  // ✅ Debugging ke liye
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = new Comment({
      text,
      postId: req.params.postId,
      userId: req.user.id,
    });

    const savedComment = await newComment.save();
    const populatedComment = await Comment.findById(savedComment._id).populate("userId", "username email");

    console.log("✅ New comment added:", populatedComment);
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * ✅ Delete a comment (Only the owner can delete)
 * @route DELETE /api/comments/:commentId
 */
router.delete("/:commentId", verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      return res.status(400).json({ message: "Invalid commentId" });
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
