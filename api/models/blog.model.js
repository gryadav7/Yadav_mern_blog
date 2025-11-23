

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    featuredImage: {
      type: String,
      required: true,
      trim: true,
    },

    blogContent: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
