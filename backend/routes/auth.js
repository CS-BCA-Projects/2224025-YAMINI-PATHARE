import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASS,  // App Password from Gmail
    },
});

// Helper function for errors
const sendError = (res, message, status = 400) => {
    console.log(`Error: ${message}`);
    return res.status(status).json({ message });
};

// 📌 User Registration (With Welcome Email)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return sendError(res, "All fields are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log(`User Registered: ${username} (Email: ${email})`);

        // 📩 Send welcome email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Untold Voice",
            text: `Hello ${username},\n\nWelcome to Untold Voice! We're excited to have you on board.\n\nBest Regards,\nUntold Voice Team`,
        });

        res.status(201).json({ message: "User registered successfully. Check your email!" });
    } catch (err) {
        console.error("Server Error (Register):", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, "All fields are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, "Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, "Invalid email or password");
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });

        console.log(`User Logged In: ${user.username} (Email: ${user.email})`);

        console.log("token is : ",token)

        res.status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // ✅ Only secure in production
          sameSite: "strict"
        })
        .json({ message: "Login successful" });
      
    } catch (err) {
        console.error("Server Error (Login):", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 Forgot Password (Send Reset Email)
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return sendError(res, "User with this email does not exist");
        }

        // Generate a password reset token (valid for 15 mins)
        const resetToken = jwt.sign({ id: user._id }, process.env.RESET_SECRET, { expiresIn: "15m" });

        // 📩 Send password reset email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Hello,\n\nClick the link below to reset your password. The link is valid for 15 minutes:\n\n${process.env.FRONTEND_URL}/reset-password/${resetToken}\n\nIf you did not request this, please ignore it.\n\nBest Regards,\nUntold Voice Team`,
        });

        console.log(`Password reset email sent to ${email}`);
        res.status(200).json({ message: "Password reset email sent. Check your inbox!" });
    } catch (err) {
        console.error("Server Error (Forgot Password):", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 Reset Password (Change Password)
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return sendError(res, "New password is required");
        }

        const decoded = jwt.verify(token, process.env.RESET_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return sendError(res, "Invalid or expired token");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        console.log(`Password reset successful for user: ${user.email}`);
        res.status(200).json({ message: "Password reset successful. You can now log in." });
    } catch (err) {
        console.error("Server Error (Reset Password):", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 User Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    console.log("User Logged Out");
    res.status(200).json({ message: "Logout successful" });
});

export default router;
