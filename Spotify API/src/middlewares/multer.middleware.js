import multer from 'multer';

const upload = multer ({ storage: multer.memoryStorage() });

export const songUpload = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]);