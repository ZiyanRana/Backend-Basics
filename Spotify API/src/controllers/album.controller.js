import AlbumModel from "../models/album.model.js";

export const createAlbum = async (req, res) => {}

export const getAlbums = async (req, res) => {
    try {
        const albums = await AlbumModel.find().select('title cover');
        res.status(200).json({ success: true, albums });
    } 
    catch (err) {
        console.error('Error fetching albums:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAlbum = async (req, res) => {
    try {
        const album = await AlbumModel.findById(req.params.id).select('title cover');
        if (!album) {
            return res.status(404).json({ message: 'Album not found!' });
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