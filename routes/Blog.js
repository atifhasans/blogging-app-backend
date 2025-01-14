import express from "express";
import { Create, deletePost, getposts, likePost, update } from "../controllers/Blog.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/Multer.js";

const BlogsRoutes = express.Router()
BlogsRoutes.post('/create',isAdmin,upload.single('postimage'),Create)
BlogsRoutes.delete('/delete/:id',isAdmin,deletePost)
BlogsRoutes.get('/getposts',getposts)
BlogsRoutes.patch('/update/:id',isAdmin,upload.single('postimage'),update)
BlogsRoutes.post('/post/like/:id', likePost);

export default BlogsRoutes