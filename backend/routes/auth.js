const express = require('express')
const router = express.Router()
const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        // Remove password before sending response
        const userResponse = { ...savedUser._doc };
        delete userResponse.password;

        res.status(201).json({ message: "User registered successfully", user: userResponse });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});

//Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(404).json({ message: 'User not found' })
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            return res.status(401).json({ message: 'wrong password' })
        }
        const token = jwt.sign({ __id, username: user.username, email: user.email }, process.env.SECRET, { expiresIn: "3d" })

        const { password, ...info } = user._doc
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        }).status(200).json(info)

    }
    catch (err) {
        res.status(500).json(err)
    }
})
//Logout
router.get('/logout', (req, res) => {
    try {
        res.clearCookie('token', {
            sameSite: 'none',
            secure: true,

        })
            .status(200)
            .send("user logged out successfully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//Refetch
router.get("/refetch", (req, res) => {
    const token = req.cookies.token
    jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
        if (err) {
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})
module.exports = router;  // ✅ Correct
