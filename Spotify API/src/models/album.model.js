import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Album title is required!'],
        index: true
    },
    cover: {
        type: String,
        required: [true, 'Album cover is required!']
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Album artist is required!']
    }
}, {timestamps: true});

const AlbumModel = mongoose.model('Album', albumSchema);

export default AlbumModel;