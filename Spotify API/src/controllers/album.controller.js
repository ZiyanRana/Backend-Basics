import AlbumModel from "../models/album.model.js";
import mongoose from "mongoose";
import { uploadImage } from "../services/imageStorage.service.js";

export const createAlbum = async (req, res) => {
    const title = req.body.title;
    const cover = req.file.cover;

    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Album title is required!' });
    }
    if (!cover || !cover.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Invalid cover image file!' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const coverUrl = await uploadImage(cover);
        const newAlbum = await AlbumModel.createOne({
            title,
            coverUrl,
            artist: req.user._id
        }, { session });

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

export const updateAlbum = async (req, res) => {
    const title = req.body.title;
    const cover = req.file.cover;
    const user = req.user;
    const id = req.params.id;

    if (title && title.trim() === '') {
        return res.status(400).json({ message: 'Album title cannot be empty!' });
    }
    if (cover && !cover.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Invalid cover image file!' });
    }
    if (req.user._id.toString() !== album.artist.toString()) {
        return res.status(403).json({ message: 'You can only update your own albums!' });
    }

    const album = await AlbumModel.findById(id).session(session);
    if(!album) {
        return res.status(404).json({ message: 'Album not found!' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {   
        if (cover) {
            const coverUrl = await uploadImage(cover);
            album.cover = coverUrl;
        }
        if (title) {
            album.title = title;
        }
        
        const updatedAlbum = await album.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ success: true, album: updatedAlbum });
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error updating album:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteAlbum = async (req, res) => {
    
}