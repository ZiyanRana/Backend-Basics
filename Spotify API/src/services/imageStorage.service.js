import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({
    privateKey: PRIVATE_KEY
});

export const uploadImage = async (file) => {
    try {
        const response = await imagekit.files.upload({
            file: file.buffer,
            fileName: song_ + Date.now() + '.jpg',
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
        const response = await imagekit.files.upload({
            file: file.buffer,
            fileName: song_ + Date.now() + '.mp3',
            folder: 'spotify-api/song-audios'
        });
        return response.url;
    }
    catch (err) {
        console.error('Error uploading audio:', err);
        throw new Error('Failed to upload audio');
    }
}