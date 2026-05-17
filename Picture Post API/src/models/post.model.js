import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Image is required!']
    },
    caption: {
        type: String,
        default: "No Caption"
    }
});

const postModel = new mongoose.model("post", postSchema);

export default postModel;