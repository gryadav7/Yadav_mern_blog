import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
   userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    blogid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  { timestamps: true }
);

const BlogLike = mongoose.model("BlogLike", likeSchema, "bloglikes");

export default BlogLike;
