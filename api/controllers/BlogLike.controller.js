import { handleError } from "../helpers/handleError.js";
import BlogLike from "../models/bloglike.model.js";

export const dolike = async (req, res, next) => {
  try {
    const { userid, blogid } = req.body;

    if (!userid || !blogid) {
      return next(handleError(400, "userid & blogid required"));
    }

    let like = await BlogLike.findOne({ userid, blogid });

    if (!like) {
      like = await BlogLike.create({ userid, blogid });
    } else {
      await BlogLike.findByIdAndDelete(like._id);
    }

    const likecount = await BlogLike.countDocuments({ blogid });

    res.status(200).json({
      likecount,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const likeCount = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const { userid } = req.query;

    if (!blogid) {
      return next(handleError(400, "blogid required"));
    }

    const likecount = await BlogLike.countDocuments({ blogid });
    let isUserLiked = false;

    if (userid) {
      const check = await BlogLike.findOne({ blogid, userid });
      if (check) isUserLiked = true;
    }

    res.status(200).json({
      likecount,
      isUserLiked,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
