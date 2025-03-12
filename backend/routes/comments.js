const express = require('express');
const Router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const Post = require('../models/Post')
const Comments = require('../models/Comments')
const verifyToken = require('../verifyToken')

//Create 
Router.post("/create", verifyToken,async(req ,res) => {
    try{
        const newComment = new Comments( req.body )
        const savedComment = await newComment.save()
        res.status(200).json(savedComment)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//update
Router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updateComment = await Comments.findbyIdAndUpdate(req.params.id,{$set:req.body},{ new:true})
        res.status(200).json(updateComment)

    }
    catch (err) {
        res.status(500).json(err)
    }
})

//delete
Router.delete("/:id",  async (req, res) => {   
    try{
 await Comment.findByIdAndDelete(req.params.id)
 res.status(200).json("comment deleted")

    }
    catch(err) {
        res.status(500).json(err)
    }
 })

 //get comments
Router.get("/post/:postId", async(req,res) => {
    try{
const comments =await Comment.find({PostId:req.params.postId})
res.status(200).json(comments)
    }

        catch(err){
            res.status(500).json(err)
        }

    })
module.exports = Router