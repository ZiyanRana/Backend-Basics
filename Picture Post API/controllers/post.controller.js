import postModel from "../src/models/post.model.js";
import { uploadFile } from "../src/services/imageStorage.service.js";

export const createPost = async (req, res, next) => {
    try {
        const result = await uploadFile(req.file.buffer);
        const posts = postModel.create({
            image: result.url,
            caption: req.body.caption
        });

        res.status(201).json({
            message: "Post created successfully!",
            post: posts[0]
        })
    }
    catch(error) {
        next(error);
    }
}