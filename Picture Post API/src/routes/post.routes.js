import { Router } from 'express';
import { createPost } from '../../controllers/post.controller.js';
import multer from 'multer';

const postRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

postRouter.post('/create', upload.single('image'), createPost);

export default postRouter;