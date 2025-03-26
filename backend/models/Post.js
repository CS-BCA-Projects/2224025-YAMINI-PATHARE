import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true }, // New category field
    content: { type: String, required: true }, // ✅ Ensure content is required
    author: { type: String, required: true },  // ✅ Ensure author is required (Use ObjectId for users if needed)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Ensure userId is linked
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
