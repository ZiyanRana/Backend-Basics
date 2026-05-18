import mongoose from "mongoose";
import postModel from "../src/models/post.model.js";
import { uploadFile } from "../src/services/imageStorage.service.js";

export const createPost = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            const error = new Error('Authorization failed, cannot create post!');
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await userModel.findById(decoded.userId).session(session);

        if (!user) {
            const error = new Error('User associated with this token does not exist!');
            error.statusCode = 404;
            throw error;
        }

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
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
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