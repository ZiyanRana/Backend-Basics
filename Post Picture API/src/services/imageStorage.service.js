import ImageKit from '@imagekit/nodejs';
import { private_key } from '../config/env.js';

const imageKit = new ImageKit({
    privateKey : private_key
});

export const uploadFile = async (buffer) => {
    const result = await imageKit.files.upload({
        file: buffer.toString("base64"),
        fileName: image.jpg
    });

    return result;
}