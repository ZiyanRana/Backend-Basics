import { Router } from 'express';
import { createPost, viewPosts, viewPost } from '../../controllers/post.controller.js';
import multer from 'multer';

const postRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

postRouter.post('/create', upload.single('image'), createPost);

postRouter.get('/view', viewPosts);

postRouter.get('/view/:id', viewPost);

export default postRouter;