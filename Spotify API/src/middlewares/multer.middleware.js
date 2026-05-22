import multer from 'multer';

const upload = multer({
   storage: multer.memoryStorage(),
   limits: {
      fileSize: 20 * 1024 * 1024
   }
});

export const songUpload = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]);