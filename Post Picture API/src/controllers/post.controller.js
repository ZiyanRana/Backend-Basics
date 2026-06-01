import postModel from "../src/models/post.model.js";
import { uploadFile } from "../src/services/imageStorage.service.js";

export const createPost = async (req, res) => {
    try {
        const postImage = req.file.buffer;
        const caption = req.body.caption;

        if (!postImage) {
            return res.status(400).json({
                message: "Image is required to create a post!"
            });
        }

        const result = await uploadFile(postImage);
        const post = postModel.create({
            image: result.url,
            caption,
        });

        res.status(201).json({
            message: "Post created successfully!",
            post
        })
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create post, please try again!"
        });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post with the given id does not exist!"
            });
        }

        await postModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Post deleted successfully!"
        });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete post, please try again!"
        });
    }
}

export const updatePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post with the given id does not exist!"
            });
        }

        if (req.file) {
            const result = await uploadFile(req.file.buffer);
            post.image = result.url;
        }

        if (req.body.caption) {
            post.caption = req.body.caption;
        }

        await post.save();

        res.status(200).json({
            message: "Post updated successfully!",
            post
        });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update post, please try again!"
        });
    }
}

export const viewPosts = async (req, res) => {
    try {
        const posts = await postModel.find();
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch posts, please try again!"
        });
    }
}

export const viewPost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post with the given id does not exist!"
            })
        }

        res.status(200).json({
            message: "Post fetched successfully",
            post
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch post, please try again!"
        });
    }
}