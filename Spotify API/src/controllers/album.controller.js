import AlbumModel from "../models/album.model.js";
import mongoose from "mongoose";
import { uploadImage } from "../services/imageStorage.service.js";

export const createAlbum = async (req, res) => {
    const title = req.body;
    const cover = req.file;

    const coverUrl = await uploadImage(cover);

    if (!title || !cover) {
        return res.status(400).json({ message: 'ALbum title and cover image are required!' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newAlbum = await AlbumModel.createOne({
            title,
            coverUrl,
            artist: req.user._id
        }).session(session);

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ success: true, album: newAlbum });
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating album:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAlbums = async (req, res) => {
    const user = req.user;
    try {
        if (user.role === 'artist') {
            const albums = await AlbumModel.find({ artist: user._id }).select('title cover');
            return res.status(200).json({ success: true, albums });
        }
        const albums = await AlbumModel.find().limit(12).select('title cover');
        res.status(200).json({ success: true, albums });
    } 
    catch (err) {
        console.error('Error fetching albums:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAlbum = async (req, res) => {
    const user = req.user;
    try {
        const album = await AlbumModel.findById(req.params.id).select('title cover');
        if (!album) {
            return res.status(404).json({ message: 'Album not found!' });
        }
        if (user.role === 'artist' && album.artist.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: Artists can only view their own albums!'});
        }
        res.status(200).json({ success: true, album });
    } 
    catch (err) {
        console.error('Error fetching album:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateAlbum = async (req, res) => {}

export const deleteAlbum = async (req, res) => {}