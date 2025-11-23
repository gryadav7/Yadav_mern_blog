import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    blogid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Comment= mongoose.model("Comment", commentSchema,'comments');

export default Comment