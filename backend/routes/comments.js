import express from "express";
import Comment from "../models/Comment.js"; // ✅ Correct

import verifyToken from "../verifyToken.js";

const router = express.Router();

// Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate("author", "username");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a new comment
router.post("/:postId", verifyToken, async (req, res) => {
  try {
    const newComment = new Comment({ text: req.body.text, post: req.params.postId, author: req.user.id });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;