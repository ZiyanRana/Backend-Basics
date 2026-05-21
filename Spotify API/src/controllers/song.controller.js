import mongoose from "mongoose";
import SongsModel from "../models/songs.model.js";
import { uploadImage, uploadAudio } from "../services/imageStorage.service.js";

export const createSong = async (req, res) => {
    const { title } = req.body;
    const { cover, audio } = req.file;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const existingSong = await SongsModel.findOne({ title: title }).session(session);
        if (existingSong) {
            return res.status(400).json({ message: 'A song with this title already exists!' });
        }

        const coverUrl = await uploadImage(cover);
        const audioUrl = await uploadAudio(audio);

        const newSong = await SongsModel.create({
            title,
            cover: coverUrl,
            audio: audioUrl,
            artist: req.user._id
        }, { session: session });

        session.commitTransaction();
        session.endSession();

        res.status(201).json(
            { 
                success: true,
                message: 'Song created successfully',
                song: newSong 
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
    try {
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

