import mongoose from "mongoose";
import SongsModel from "../models/songs.model.js";

export const createSong = async (req, res) => {
    const { title, cover, audio } = req.body;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const existingSong = await SongsModel.findOne({ title: title }).session(session);
        if (existingSong) {
            return res.status(400).json({ message: 'A song with this title already exists!' });
        }

        const newSong = await SongsModel.create({
            title,
            cover,
            audio,
            artist: req.user._id
        }.session(session));

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