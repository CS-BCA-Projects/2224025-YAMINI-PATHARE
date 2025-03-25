import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    Comment: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Use `export default` for ES Modules
export default mongoose.model("Comment", CommentSchema);
