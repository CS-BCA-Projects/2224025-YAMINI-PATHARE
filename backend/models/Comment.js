import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    Comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Use `export default` for ES Modules
export default mongoose.model("Comment", CommentSchema);
