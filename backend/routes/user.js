import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt for compatibility
import Post from "../models/Post.js";
import Comment from "../models/Comment.js"; // ✅ Correct
import verifyToken from "../verifyToken.js";

const router = express.Router(); // Fix casing issue (Router -> router)


// Update User
router.put("/:id", verifyToken, async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt); // ✅ Fix hash function
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete User
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Post.deleteMany({ user: req.params.id });
        await Comment.deleteMany({ userId: req.params.id });

        res.status(200).json("User has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get User
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc;
        res.status(200).json(info);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router; 