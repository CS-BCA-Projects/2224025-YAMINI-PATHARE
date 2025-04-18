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
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict"
            })
          .json({
            message: "Login successful",
            token,                    // ✅ Include this
            user: {
            id: user._id,
            username: user.username,
            email: user.email
           }
        });

      
    } catch (err) {
        console.error("Server Error (Login):", err);
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
