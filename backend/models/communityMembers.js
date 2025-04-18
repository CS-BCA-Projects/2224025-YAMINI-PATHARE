import mongoose from "mongoose";

const communityMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CommunityMember", communityMemberSchema);
