import mongoose from "mongoose";
import postModel from "../src/models/post.model.js";
import { uploadFile } from "../src/services/imageStorage.service.js";

export const createPost = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await uploadFile(req.file.buffer);
        const posts = postModel.create([{
            image: result.url,
            caption: req.body.caption
        }]);

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Post created successfully!",
            post: posts[0]
        })
    }
    catch(error) {
        
        next(error);
    }
}

export const viewPosts = async (req, res, next) => {
    try {
        const posts = await postModel.find();
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts
        });
    }
    catch (error) {
        next(error);
    }
}

export const viewPost = async (req, res, next) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            const error = new Error("Post with the given id does not exist on the DB!");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: "Post fetched successfully",
            post
        });
    }
    catch (error) {
        next(error);
    }
}