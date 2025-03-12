const express = require('express');
const User = require('../models/User')
const bcrypt = require('bcrypt')
const Post = require('../models/Post')
const Comment = require('../models/Post')
const Router = express.Router();
const verifyToken = require('../verifyToken')

//Create 
Router.post("/create", verifyToken,async(req ,res) => {
    try{
        const newPost  = new Post( req.body )
        const savedPost = await newPost.save()
        res.status(201).json(savedPost)

    }
    catch(err){
        res.status(500).json(err)
    }
})
//update
Router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatePost = await Post.findbyIdAndUpdate(req.params.id, { $set: req.body },{ new: true})
        res.status(200).json(updatePost)

    }
    catch (err) {
        res.status(500).json(err)
    }
})

//delete
Router.delete("/:id",  async (req, res) => {   
    try{
         await Post.findbyIdAndDelete(req.params.id)
        await Comment.deleteMany({PostId:req.params.id})
        res.status(200).json("Post deleted")
      }
    catch(err) {
        res.status(500).json(err)
    }
 })

 //get post details
 Router.get("/:id", async (req, res) => {  
try{
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)

    }
catch(err){
    res.status(500).json(err)
}


  })
  //GET Post
Router.get("/", async (req, res) => {
    try {
            const searchFilter = {
             title: { $regex: req.query.search, $options: "i" }
         }
    const post = await Post.find(express.query.search?
         searchFilter : {})
         res.status(200).json(posts)
        }
    
    catch(err){
        res.status(500).json(err)
    }
})
//get user post
Router.get("/user/:userId", async(req,res) =>
{
    try{    
        const posts = await Post.find(  {
            userId:req.params.userId})
            res.status(200).json(posts)
        }

    catch(err){
        res.status(500).json(err)

    }
})
module.exports = Router;