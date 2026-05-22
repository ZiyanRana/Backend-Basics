import mongoose from "mongoose";
import SongsModel from "../models/songs.model.js";
import { uploadImage, uploadAudio, deleteFile } from "../services/imageStorage.service.js";

export const createSong = async (req, res) => {
    const title = req.body.title;
    const cover = req.files.cover[0];
    const audio = req.files.audio[0];

    if (!cover || !cover.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Invalid cover image file!' });
    }
    if (!audio || !audio.mimetype.startsWith('audio/')) {
        return res.status(400).json({ message: 'Invalid audio file!' });
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const existingSong = await SongsModel.findOne({ title: title }, { session });
        if (existingSong) {
            return res.status(400).json({ message: 'A song with this title already exists!' });
        }

        const coverUrl = await uploadImage(cover);
        const audioUrl = await uploadAudio(audio);

        const newSong = await SongsModel.create({
            title,
            cover: coverUrl,
            audio: audioUrl,
            artist: user._id
        }, { session });

        session.commitTransaction();
        session.endSession();

        res.status(201).json(
            { 
                success: true,
                message: 'Song created successfully',
                song: newSong[0]
            });
    }
    catch (err) {
        session.abortTransaction();
        session.endSession();
        console.error('Error creating song:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSongs = async (req, res) => {
    const user = req.user;
    try {
        if (user.role === 'artist') {
            const songs = await SongsModel.find({ artist: user._id });
            return res.status(200).json({ success: true, songs });
        }

        const songs = await SongsModel.find().limit(20).populate('artist', 'username');
        res.status(200).json({ success: true, songs });
    }
    catch (err) {
        console.error('Error fetching songs:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSong = async (req, res) => {
    const id = req.params.id;

    try {
        const song = await SongsModel.findById(id).populate('artist', 'username');

        if (!song) {
            return res.status(404).json({ message: 'Song not found!' });
        }
        res.status(200).json({ success: true, song });
    }
    catch (err) {
        console.error('Error fetching song:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateSong = async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const cover = req.files.cover[0];
    const audio = req.files.audio[0];
    const user = req.user;

    if (title && title.trim() === '') {
        return res.status(400).json({ message: 'Song title cannot be empty!' });
    }
    if (cover && !cover.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Invalid cover image file!' });
    }
    if (audio && !audio.mimetype.startsWith('audio/')) {
        return res.status(400).json({ message: 'Invalid audio file!' });
    }

    const song = await SongsModel.findById(id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found!' });
    }
    if (song.artist.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'You can only update your own songs!' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (title) {
            song.title = title;
        }
        if (cover) {
            const coverUrl = await uploadImage(cover);
            song.cover = coverUrl;
        }
        if (audio) {
             const audioUrl = await uploadAudio(audio);
             song.audio = audioUrl;
        }

        const updatedSong = await song.save({ session });
        
        session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Song updated successfully', song: updatedSong });
    }
    catch (err) {
        session.abortTransaction();
        session.endSession();
        console.error('Error updating song:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteSong = async (req, res) => {
    const id = req.params.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const song = await SongsModel.findById(id).session(session);
        if (!song) {
            return res.status(404).json({ message: 'Song not found!' });
        }
        if (song.artist !== req.user._id) {
            return res.status(403).json({ message: 'You can only delete your own songs!' });
        }
        await SongsModel.deleteOne({ _id: id }, { session });
        await deleteFile(song.cover);
        await deleteFile(song.audio);

        session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Song deleted successfully' });
    }
    catch (err) {
        session.abortTransaction();
        session.endSession();
        console.error('Error deleting song:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}