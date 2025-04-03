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
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const comments = await Comment.find({ postId })
      .populate("userId", "username email")
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
    const { postId } = req.params;
    const { text } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = new Comment({
      text,
      postId,
      userId: req.user.id,
    });

    const savedComment = await newComment.save();
    const populatedComment = await Comment.findById(savedComment._id).populate("userId", "username email");

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * ✅ Update a comment
 * @route PUT /api/comments/:commentId
 */
router.put("/:commentId", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid commentId" });
    }

    if (!text?.trim()) {
      return res.status(400).json({ message: "Updated comment text is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this comment" });
    }

    comment.text = text;
    const updatedComment = await comment.save();
    res.status(200).json(updatedComment);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * ✅ Delete a comment
 * @route DELETE /api/comments/:commentId
 */
router.delete("/:commentId", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid commentId" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
