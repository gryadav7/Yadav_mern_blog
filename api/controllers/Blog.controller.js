import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import Blog from "../models/blog.model.js";
import { encode } from "entities";
import Category from "../models/category.model.js";


// ----------------------------------------------------------
// ADD BLOG
// ----------------------------------------------------------
export const addBlog = async (req, res, next) => {
    try {
        const data = JSON.parse(req.body.data);

        let featuredImage = "";

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "MERN_BLOG",
                resource_type: "auto",
            });
            featuredImage = uploadResult.secure_url;
        }

        const blog = new Blog({
            author: data.author,
            category: data.category,
            title: data.title,
            slug: data.slug,
            featuredImage: featuredImage,
            blogContent: encode(data.blogContent),
        });

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog added successfully.",
        });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


// ----------------------------------------------------------
// EDIT BLOG
// ----------------------------------------------------------
export const editBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params;
        const blog = await Blog.findById(blogid).populate("category", "name");

        if (!blog) return next(handleError(404, "Blog not found"));

        res.status(200).json({ blog });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


// ----------------------------------------------------------
// UPDATE BLOG
// ----------------------------------------------------------
export const updateBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params;
        const data = JSON.parse(req.body.data);

        const blog = await Blog.findById(blogid);

        blog.category = data.category;
        blog.title = data.title;
        blog.slug = data.slug;
        blog.blogContent = encode(data.blogContent);

        let featuredImage = blog.featuredImage;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "MERN_BLOG",
                resource_type: "auto",
            });

            featuredImage = uploadResult.secure_url;
        }

        blog.featuredImage = featuredImage;
        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog updated successfully.",
        });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


// ----------------------------------------------------------
// DELETE BLOG
// ----------------------------------------------------------
export const deleteBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params;

        await Blog.findByIdAndDelete(blogid);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully.",
        });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


// ----------------------------------------------------------
// ⭐ PUBLIC BLOGS (HOME PAGE)
// ----------------------------------------------------------


export const showPublicBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name avatar role")
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ blog: blogs });

    } catch (error) {
        next(handleError(500, error.message));
    }
};



// ----------------------------------------------------------
// ⭐ USER / ADMIN BLOGS (DASHBOARD)
// ----------------------------------------------------------



export const showUserBlogs = async (req, res, next) => {
    try {
        const user = req.user;
        let blogs;

        if (user.role === "admin") {
            // Admin -> All blogs
            blogs = await Blog.find()
                .populate("author", "name avatar role")
                .populate("category", "name slug")
                .sort({ createdAt: -1 })
                .lean();
        } else {
            // Normal User -> Only own blogs
            blogs = await Blog.find({ author: user._id })
                .populate("author", "name avatar role")
                .populate("category", "name slug")
                .sort({ createdAt: -1 })
                .lean();
        }

        res.status(200).json({ blog: blogs });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


// ----------------------------------------------------------
// GET BLOG DETAILS
// ----------------------------------------------------------
export const getBlog = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const blog = await Blog.findOne({ slug })
            .populate("author", "name avatar role")
            .populate("category", "name slug");

        if (!blog) return next(handleError(404, "Blog not found"));

        res.status(200).json({ blog });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


// ----------------------------------------------------------
// RELATED BLOG
// ----------------------------------------------------------
export const getRelatedBlog = async (req, res, next) => {
    try {
        const { category, blog } = req.params;

        const categoryData = await Category.findOne({ slug: category });

        if (!categoryData) return next(handleError(404, "Category not found"));

        const relatedBlog = await Blog.find({
            category: categoryData._id,
            slug: { $ne: blog }
        }).lean();

        res.status(200).json({ relatedBlog });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


// ----------------------------------------------------------
// BLOG BY CATEGORY
// ----------------------------------------------------------
export const getBlogByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;

        const categoryData = await Category.findOne({ slug: category });

        if (!categoryData) return next(handleError(404, "Category not found"));

        const blog = await Blog.find({ category: categoryData._id })
            .populate("author", "name avatar role")
            .populate("category", "name slug")
            .lean();

        res.status(200).json({ blog, categoryData });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


// ----------------------------------------------------------
// SEARCH BLOG
// ----------------------------------------------------------
export const search = async (req, res, next) => {
    try {
        const { q } = req.query;

        const blog = await Blog.find({
            title: { $regex: q, $options: "i" }
        })
            .populate("author", "name avatar role")
            .populate("category", "name slug")
            .lean();

        res.status(200).json({ blog });

    } catch (error) {
        next(handleError(500, error.message));
    }
};
