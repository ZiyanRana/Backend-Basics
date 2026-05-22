import ImageKit from '@imagekit/nodejs';
import { PRIVATE_KEY } from '../config/env.js';
import path from 'path';

const imagekit = new ImageKit({
    privateKey: PRIVATE_KEY
});

export const uploadImage = async (file) => {
    try {
        const extension = path.extname(file.originalname);
        const response = await imagekit.files.upload({
            file: file.buffer.toString('base64'),
            fileName: `song_cover_${Date.now()}${extension}`,
            folder: 'spotify-api/song-covers'
        });
        return response.url;
    }
    catch (err) {
        console.error('Error uploading image:', err);
        throw new Error('Failed to upload image');
    }
}

export const uploadAudio = async (file) => {
    try {
        const extension = path.extname(file.originalname);
        const response = await imagekit.files.upload({
            file: file.buffer.toString('base64'),
            fileName: `song_audio_${Date.now()}${extension}`,
            folder: 'spotify-api/song-audios'
        });
        return response.url;
    }
    catch (err) {
        console.error('Error uploading audio:', err);
        throw new Error('Failed to upload audio');
    }
}

export const deleteFile = async (file) => {
    try {
        const fileId = path.basename(file, path.extname(file));
        await imagekit.files.deleteFile(fileId);
    }
    catch (err) {
        console.error('Error deleting file:', err);
        throw new Error('Failed to delete file');
    }
}