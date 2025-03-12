const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Post = require('../models/Post'); // ✅ Fix lowercase 'post' -> 'Post'
const Comment = require('../models/Comments');
const verifyToken = require('../verifyToken');

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

module.exports = router; // ✅ Fix module.export -> module.exports
 