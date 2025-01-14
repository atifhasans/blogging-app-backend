import PostModel from "../models/Blog.js";
import mongoose from "mongoose";
import fs from 'fs'
import path from 'path'

const Create = async (req, res) => {
    try {
        const { title, desc } = req.body;
        const imagePath = req.file?.filename || null;

        const CreateBlog = new PostModel({
            title,
            desc,
            image: imagePath
        })
        await CreateBlog.save()
        return res.status(200).json({
            success: true,
            message: "Post created successfully",
            post: CreateBlog
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID",
            });
        }

        const FindPost = await PostModel.findById(postId);

        if (!FindPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (FindPost.image) {
            const profilepath = path.join('public/images',FindPost.image)
            fs.promises.unlink(profilepath)
            .then(() => console.log('Post image deleted'))
            .catch(error => console.log('Error deleting post image',error))
        }

        await PostModel.findByIdAndDelete(postId);
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getposts = async (req, res) => {
    try {
        const posts = await PostModel.find()
        if (!posts) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        return res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const update = async (req, res) => {
    try {
        const { title, desc } = req.body;
        const postId = req.params.id;

        const postUpdate = await PostModel.findById(postId)
        if (!postUpdate) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        if (title) {
            postUpdate.title = title
        }
        if (desc) {
            postUpdate.desc = desc
        }
        if (req.file) {
            postUpdate.image = req.file.filename
        }
        await postUpdate.save()
        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post:postUpdate
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const likePost = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const { userId } = req.body; // User ID

        // Validate Post ID and User ID
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID or User ID",
            });
        }

        // Find the post
        const post = await PostModel.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Check if the user has already liked the post
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            // Unlike the post
            post.likes = post.likes.filter((id) => id.toString() !== userId);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Post unliked",
                likes: post.likes.length,
            });
        }

        // Like the post
        post.likes.push(userId);
        await post.save();
        return res.status(200).json({
            success: true,
            message: "Post liked",
            likes: post.likes.length,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export { Create, deletePost, getposts, update, likePost }