require('dotenv').config({ path: './.env' });
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const cookiesParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const commentRoute = require('./routes/comments')
const commentModels = require('./models/Comments');

const corsOptions = {
    origin: '*',
    credentials: true, // Fix spelling (was 'credential')
};
app.use(cors(corsOptions));  // ✅ This ensures proper middleware function usage.
console.log(typeof cors, typeof cors(corsOptions));
console.log("PORT:", process.env.PORT);
console.log("MONGO_URL:", process.env.MONGO_URL);


//middleware

app.use(express.json())


app.use("/images", express.static(path.join(__dirname, "/images")));

console.log(cors())
app.use(cookiesParser())
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
console.log("I am here")
  // Extra space at the end
app.use('/api/posts', postRoute)  // Extra space at the end    
app.use('/api/comments', commentRoute)
//upload img
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, 'images')
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img)
    }
})

const upload = multer({ storage: storage })
app.post('/api/upload', upload.single('img'), (req, res) => {
    res.status(200).json({ msg: 'file uploaded successfully' })
})

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
};

// Start Server AFTER Database Connects
const startServer = async () => {
    await ConnectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();
