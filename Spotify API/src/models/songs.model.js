import mongoose from "mongoose";

const songsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Song title is required!'],
        trim: true,
        minLength: 1,
        maxLength: 100,
        index: true
    },
    cover: {
        type: String,
        required: [true, 'Song cover is required!']
    },
    audio: {
        type: String,
        required: [true, 'Song audio is required!']
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Song artist is required!']
    }
}, {timestamps: true});

const SongsModel = mongoose.model('Songs', songsSchema);

export default SongsModel;