import express from 'express'
import { 
  addBlog, 
  deleteBlog, 
  editBlog, 
  updateBlog,
  getBlog,
  getRelatedBlog,
  getBlogByCategory,
  search,
  showPublicBlogs,     // NEW
  showUserBlogs        // NEW
} from '../controllers/Blog.controller.js'

import upload from '../config/multer.js'
import { authenticate } from '../middleware/authenticate.js'

const BlogRoute = express.Router()

// Add new blog
BlogRoute.post('/add', authenticate, upload.single('file'), addBlog)

// Edit blog
BlogRoute.get('/edit/:blogid', authenticate, editBlog)

// Update blog
BlogRoute.put('/update/:blogid', authenticate, upload.single('file'), updateBlog)

// Delete blog
BlogRoute.delete('/delete/:blogid', authenticate, deleteBlog)


// ⭐ PUBLIC ROUTE (Home page)
BlogRoute.get('/all-public', showPublicBlogs)


// ⭐ USER/ADMIN (Dashboard)
BlogRoute.get('/get-all', authenticate, showUserBlogs)


// Other routes
BlogRoute.get('/get-blog/:slug', getBlog)
BlogRoute.get('/get-related-blog/:category/:blog', getRelatedBlog);
BlogRoute.get('/get-blog-by-category/:category', getBlogByCategory)
BlogRoute.get('/search', search)

export default BlogRoute

