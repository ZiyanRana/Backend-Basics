import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Album title is required!']
    },
    cover: {
        type: String,
        required: [true, 'Album cover is required!']
    }
}, {timestamps: true});

const AlbumModel = mongoose.model('Album', albumSchema);

export default AlbumModel;